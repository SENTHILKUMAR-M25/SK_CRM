const { Op } = require('sequelize');
const { User, Lead, FollowUpHistory, ActivityLog, Document } = require('../models');

const createActivityLog = async (leadId, userId, action, description, details = {}) => {
  try {
    await ActivityLog.create({ lead: leadId, user: userId, action, description, details });
  } catch (error) {
    console.error('Activity log error:', error);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const { search, status, priority, service, leadSource, dateFrom, dateTo, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { companyName: { [Op.like]: `%${search}%` } },
        { contactPerson: { [Op.like]: `%${search}%` } },
        { contactNumber: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (service) where.serviceRequired = service;
    if (leadSource) where.leadSource = leadSource;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
      if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
    }

    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count: total, rows: leads } = await Lead.findAndCountAll({
      where,
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] }],
      order: [[sortField, sortOrder]],
      offset: (page - 1) * limit,
      limit: parseInt(limit)
    });

    res.json({
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] }]
    });
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const documents = await Document.findAll({ where: { lead: lead.id } });
    const followUps = await FollowUpHistory.findAll({
      where: { lead: lead.id },
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    const activities = await ActivityLog.findAll({
      where: { lead: lead.id },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    const leadJson = lead.toJSON();
    leadJson.documents = documents;

    res.json({ lead: leadJson, followUps, activities });
  } catch (error) {
    next(error);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    const leadData = { ...req.body };

    if (leadData.nextFollowUpDate) {
      if (leadData.status !== 'Waiting') {
        delete leadData.nextFollowUpDate;
        delete leadData.nextFollowUpTime;
      }
    }

    const lead = await Lead.create(leadData);

    await createActivityLog(
      lead.id,
      req.user.id,
      'Lead Created',
      `New lead created for ${lead.companyName}`,
      { status: lead.status, priority: lead.priority }
    );

    if (lead.nextFollowUpDate && lead.status === 'Waiting') {
      await FollowUpHistory.create({
        lead: lead.id,
        followUpDate: lead.nextFollowUpDate,
        followUpTime: lead.nextFollowUpTime,
        status: 'Waiting',
        remark: lead.remark || 'Lead created - waiting for follow-up',
        nextFollowUpDate: lead.nextFollowUpDate,
        nextFollowUpTime: lead.nextFollowUpTime,
        createdBy: req.user.id
      });
    }

    const created = await Lead.findByPk(lead.id, {
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({ message: 'Lead created successfully', lead: created });
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    const updateData = { ...req.body };

    if (updateData.status !== 'Waiting') {
      updateData.nextFollowUpDate = null;
      updateData.nextFollowUpTime = '';
    }

    await Lead.update(updateData, { where: { id: req.params.id } });

    const updatedLead = await Lead.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] }]
    });

    await createActivityLog(
      lead.id,
      req.user.id,
      'Lead Updated',
      `Lead ${lead.companyName} updated`,
      { changes: { from: oldStatus, to: updatedLead.status } }
    );

    res.json({ message: 'Lead updated successfully', lead: updatedLead });
  } catch (error) {
    next(error);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await FollowUpHistory.destroy({ where: { lead: lead.id } });
    await ActivityLog.destroy({ where: { lead: lead.id } });
    await Document.destroy({ where: { lead: lead.id } });
    await Lead.destroy({ where: { id: lead.id } });

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const doc = await Document.create({
      lead: lead.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype
    });

    await createActivityLog(
      lead.id,
      req.user.id,
      'Document Uploaded',
      `Document ${req.file.originalname} uploaded for ${lead.companyName}`
    );

    const documents = await Document.findAll({ where: { lead: lead.id } });
    const leadJson = lead.toJSON();
    leadJson.documents = documents;

    res.json({ message: 'Document uploaded successfully', lead: leadJson });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await Document.destroy({ where: { id: req.params.docId, lead: lead.id } });

    const documents = await Document.findAll({ where: { lead: lead.id } });
    const leadJson = lead.toJSON();
    leadJson.documents = documents;

    res.json({ message: 'Document deleted successfully', lead: leadJson });
  } catch (error) {
    next(error);
  }
};

exports.getFilterOptions = async (req, res, next) => {
  try {
    const services = await Lead.findAll({
      attributes: ['serviceRequired'],
      group: ['serviceRequired']
    });
    const leadSources = await Lead.findAll({
      attributes: ['leadSource'],
      group: ['leadSource']
    });
    const statuses = ['Waiting', 'Approved', 'Rejected'];
    const priorities = ['High', 'Medium', 'Low'];

    res.json({
      services: services.map(s => s.serviceRequired).filter(Boolean),
      leadSources: leadSources.map(s => s.leadSource).filter(Boolean),
      statuses,
      priorities
    });
  } catch (error) {
    next(error);
  }
};
