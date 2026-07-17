const { Op } = require('sequelize');
const { Lead, User } = require('../models');
const ExcelJS = require('exceljs');

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const escapeCSV = (val) => {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { status, priority, dateFrom, dateTo } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
    }

    const leads = await Lead.findAll({
      where,
      include: [{ model: User, as: 'assignedToUser', attributes: ['name'] }]
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');

    const fields = ['Company Name', 'Contact Person', 'Contact Number', 'Email', 'Website', 'Service Required', 'Lead Source', 'Priority', 'Status', 'Remark', 'Next Follow-up', 'Assigned To', 'Created Date'];
    let csv = fields.join(',') + '\n';

    leads.forEach(lead => {
      const assignedName = lead.assignedToUser ? lead.assignedToUser.name : '';
      const row = [
        lead.companyName, lead.contactPerson, lead.contactNumber, lead.email,
        lead.website, lead.serviceRequired, lead.leadSource, lead.priority,
        lead.status, lead.remark,
        lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : '',
        assignedName,
        formatDate(lead.createdAt)
      ].map(escapeCSV);
      csv += row.join(',') + '\n';
    });

    res.send(csv);
  } catch (error) {
    next(error);
  }
};

exports.exportExcel = async (req, res, next) => {
  try {
    const { status, priority, dateFrom, dateTo } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
    }

    const leads = await Lead.findAll({
      where,
      include: [{ model: User, as: 'assignedToUser', attributes: ['name'] }]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leads');

    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Contact Person', key: 'contactPerson', width: 20 },
      { header: 'Contact Number', key: 'contactNumber', width: 18 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Website', key: 'website', width: 25 },
      { header: 'Service Required', key: 'serviceRequired', width: 25 },
      { header: 'Lead Source', key: 'leadSource', width: 15 },
      { header: 'Priority', key: 'priority', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Remark', key: 'remark', width: 30 },
      { header: 'Next Follow-up', key: 'nextFollowUpDate', width: 18 },
      { header: 'Assigned To', key: 'assignedToName', width: 20 },
      { header: 'Created Date', key: 'createdAtFormatted', width: 18 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    leads.forEach(lead => {
      const assignedName = lead.assignedToUser ? lead.assignedToUser.name : '';
      worksheet.addRow({
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        contactNumber: lead.contactNumber,
        email: lead.email,
        website: lead.website,
        serviceRequired: lead.serviceRequired,
        leadSource: lead.leadSource,
        priority: lead.priority,
        status: lead.status,
        remark: lead.remark,
        nextFollowUpDate: lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : '',
        assignedToName: assignedName,
        createdAtFormatted: formatDate(lead.createdAt)
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leads-export.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};
