const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/db');
const { Lead, FollowUpHistory, ActivityLog, User } = require('../models');

const buildWhere = (query) => {
  const where = {};
  const { status, service, source, priority, assignedTo, dateFrom, dateTo } = query;
  if (status) where.status = status;
  if (service) where.serviceRequired = service;
  if (source) where.leadSource = source;
  if (priority) where.priority = priority;
  if (assignedTo) where.assignedTo = assignedTo;
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt[Op.lte] = end;
    }
  }
  return where;
};

const getDateRange = (query) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 86400000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  if (query.dateFrom) {
    const d = new Date(query.dateFrom);
    return { startOfToday, endOfToday, startOfMonth: d, startOfPrevMonth: new Date(d.getFullYear(), d.getMonth() - 1, 1), endOfPrevMonth: new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59, 999) };
  }
  return { startOfToday, endOfToday, startOfMonth, startOfPrevMonth, endOfPrevMonth };
};

const getPeriodCount = async (model, where, dateField, start, end) => {
  return model.count({ where: { ...where, [dateField]: { [Op.gte]: start, [Op.lt]: end } } });
};

exports.getOverview = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const { startOfToday, endOfToday, startOfMonth, startOfPrevMonth, endOfPrevMonth } = getDateRange(req.query);

    const periodWhere = { ...where, createdAt: { ...(where.createdAt || {}), [Op.gte]: startOfMonth } };

    const [
      totalLeads, waitingLeads, approvedLeads, rejectedLeads,
      newLeads, totalFollowups, todayFollowups, overdueFollowups,
      prevTotal, prevApproved, prevRejected, prevNewLeads, prevTotalFollowups, prevOverdue,
      avgResult
    ] = await Promise.all([
      Lead.count({ where }),
      Lead.count({ where: { ...where, status: 'Waiting' } }),
      Lead.count({ where: { ...where, status: 'Approved' } }),
      Lead.count({ where: { ...where, status: 'Rejected' } }),
      Lead.count({ where: periodWhere }),
      FollowUpHistory.count(),
      FollowUpHistory.count({ where: { followUpDate: { [Op.gte]: startOfToday, [Op.lt]: endOfToday } } }),
      Lead.count({ where: { ...where, status: 'Waiting', nextFollowUpDate: { [Op.lt]: startOfToday, [Op.ne]: null } } }),
      Lead.count({ where: { ...where, createdAt: { [Op.gte]: startOfPrevMonth, [Op.lte]: endOfPrevMonth } } }),
      Lead.count({ where: { ...where, status: 'Approved', createdAt: { [Op.gte]: startOfPrevMonth, [Op.lte]: endOfPrevMonth } } }),
      Lead.count({ where: { ...where, status: 'Rejected', createdAt: { [Op.gte]: startOfPrevMonth, [Op.lte]: endOfPrevMonth } } }),
      getPeriodCount(Lead, where, 'createdAt', startOfPrevMonth, endOfPrevMonth),
      FollowUpHistory.count({ where: { createdAt: { [Op.gte]: startOfPrevMonth, [Op.lte]: endOfPrevMonth } } }),
      Lead.count({ where: { ...where, status: 'Waiting', nextFollowUpDate: { [Op.lt]: new Date(startOfPrevMonth), [Op.ne]: null } } }),
      sequelize.query(
        `SELECT AVG(DATEDIFF(f.followUpDate, l.createdAt)) as avgDays
         FROM follow_up_history f INNER JOIN leads l ON f.lead = l.id
         WHERE f.id IN (SELECT MIN(f2.id) FROM follow_up_history f2 GROUP BY f2.lead)`,
        { type: sequelize.QueryTypes.SELECT }
      )
    ]);

    const decided = approvedLeads + rejectedLeads;
    const conversionRate = decided > 0 ? parseFloat(((approvedLeads / decided) * 100).toFixed(1)) : 0;
    const prevDecided = prevApproved + prevRejected;
    const prevConv = prevDecided > 0 ? parseFloat(((prevApproved / prevDecided) * 100).toFixed(1)) : 0;
    const avgResponseTime = avgResult[0]?.avgDays ? parseFloat(parseFloat(avgResult[0].avgDays).toFixed(1)) : 0;

    const calcChange = (curr, prev) => prev > 0 ? parseFloat((((curr - prev) / prev) * 100).toFixed(1)) : 0;

    res.json({
      totalLeads, newLeads, approvedLeads, waitingLeads, rejectedLeads,
      conversionRate, totalFollowups, todayFollowups, overdueFollowups, avgResponseTime,
      changes: {
        totalLeads: calcChange(totalLeads, prevTotal),
        newLeads: calcChange(newLeads, prevNewLeads),
        approvedLeads: calcChange(approvedLeads, prevApproved),
        waitingLeads: 0,
        rejectedLeads: calcChange(rejectedLeads, prevRejected),
        conversionRate: parseFloat((conversionRate - prevConv).toFixed(1)),
        totalFollowups: calcChange(totalFollowups, prevTotalFollowups),
        todayFollowups: 0,
        overdueFollowups: calcChange(overdueFollowups, prevOverdue),
        avgResponseTime: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMonthly = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const dateFrom = req.query.dateFrom || new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1).toISOString().split('T')[0];
    const dateTo = req.query.dateTo || new Date().toISOString().split('T')[0];
    const endDate = new Date(dateTo);
    endDate.setHours(23, 59, 59, 999);

    const monthlyLeads = await Lead.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { ...where, createdAt: { [Op.gte]: new Date(dateFrom), [Op.lte]: endDate } },
      group: [literal('DATE_FORMAT(createdAt, \'%Y-%m\')')],
      order: [literal('DATE_FORMAT(createdAt, \'%Y-%m\') ASC')],
      raw: true
    });

    const monthlyApproved = await Lead.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: { ...where, status: 'Approved', createdAt: { [Op.gte]: new Date(dateFrom), [Op.lte]: endDate } },
      group: [literal('DATE_FORMAT(createdAt, \'%Y-%m\')')],
      order: [literal('DATE_FORMAT(createdAt, \'%Y-%m\') ASC')],
      raw: true
    });

    const fillMonths = (data, months) => {
      const map = {};
      data.forEach(d => { map[d.month] = parseInt(d.count); });
      return months.map(m => ({ month: m, count: map[m] || 0 }));
    };

    const months = [];
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    while (start <= end) {
      const y = start.getFullYear();
      const m = String(start.getMonth() + 1).padStart(2, '0');
      months.push(`${y}-${m}`);
      start.setMonth(start.getMonth() + 1);
    }

    res.json({
      monthlyLeads: fillMonths(monthlyLeads, months),
      monthlyApproved: fillMonths(monthlyApproved, months)
    });
  } catch (error) {
    next(error);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const stats = await Lead.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['status'],
      raw: true
    });
    const result = { waiting: 0, approved: 0, rejected: 0 };
    stats.forEach(s => { result[s.status.toLowerCase()] = parseInt(s.count); });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getFollowups = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 86400000);
    const weekAgo = new Date(startOfToday.getTime() - 7 * 86400000);
    const leadWhere = buildWhere(req.query);

    const totalFollowups = await FollowUpHistory.count();
    const completedToday = await FollowUpHistory.count({
      where: { followUpDate: { [Op.gte]: startOfToday, [Op.lt]: endOfToday } }
    });
    const overdue = await Lead.count({
      where: { ...leadWhere, status: 'Waiting', nextFollowUpDate: { [Op.lt]: startOfToday, [Op.ne]: null } }
    });
    const upcoming = await Lead.count({
      where: { ...leadWhere, status: 'Waiting', nextFollowUpDate: { [Op.gte]: endOfToday } }
    });
    const completionRate = totalFollowups > 0
      ? parseFloat(((completedToday / (completedToday + overdue + upcoming)) * 100).toFixed(1))
      : 0;

    const weeklyTrend = await FollowUpHistory.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('followUpDate'), '%Y-%m-%d'), 'date'],
        [fn('COUNT', col('id')), 'completed']
      ],
      where: { followUpDate: { [Op.gte]: weekAgo, [Op.lt]: endOfToday } },
      group: [literal('DATE_FORMAT(followUpDate, \'%Y-%m-%d\')')],
      order: [literal('DATE_FORMAT(followUpDate, \'%Y-%m-%d\') ASC')],
      raw: true
    });

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(weekAgo.getTime() + i * 86400000);
      days.push(d.toISOString().split('T')[0]);
    }
    const trendMap = {};
    weeklyTrend.forEach(d => { trendMap[d.date] = parseInt(d.completed); });

    res.json({
      completedToday,
      pendingToday: upcoming,
      overdue,
      upcoming,
      completionRate,
      weeklyTrend: days.map(d => ({ date: d, completed: trendMap[d] || 0 }))
    });
  } catch (error) {
    next(error);
  }
};

exports.getServices = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const services = await Lead.findAll({
      attributes: [
        'serviceRequired',
        [fn('COUNT', col('id')), 'total'],
        [fn('SUM', literal('CASE WHEN status = \'Approved\' THEN 1 ELSE 0 END')), 'approved'],
        [fn('SUM', literal('CASE WHEN status = \'Waiting\' THEN 1 ELSE 0 END')), 'waiting'],
        [fn('SUM', literal('CASE WHEN status = \'Rejected\' THEN 1 ELSE 0 END')), 'rejected']
      ],
      where,
      group: ['serviceRequired'],
      order: [[literal('COUNT(id)'), 'DESC']],
      raw: true
    });

    res.json(services.map(s => {
      const total = parseInt(s.total);
      const approved = parseInt(s.approved);
      const rejected = parseInt(s.rejected);
      const decided = approved + rejected;
      return {
        service: s.serviceRequired,
        total,
        approved,
        waiting: parseInt(s.waiting),
        rejected,
        conversionRate: decided > 0 ? parseFloat(((approved / decided) * 100).toFixed(1)) : 0
      };
    }));
  } catch (error) {
    next(error);
  }
};

exports.getSources = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const sources = await Lead.findAll({
      attributes: [
        'leadSource',
        [fn('COUNT', col('id')), 'count']
      ],
      where,
      group: ['leadSource'],
      order: [[literal('COUNT(id)'), 'DESC']],
      raw: true
    });
    res.json(sources.map(s => ({ source: s.leadSource, count: parseInt(s.count) })));
  } catch (error) {
    next(error);
  }
};

exports.getPriorities = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const priorities = await Lead.findAll({
      attributes: ['priority', [fn('COUNT', col('id')), 'count']],
      where,
      group: ['priority'],
      raw: true
    });
    const result = { high: 0, medium: 0, low: 0 };
    priorities.forEach(p => { result[p.priority.toLowerCase()] = parseInt(p.count); });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getTopCompanies = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const conditions = ['1=1'];
    const params = [];
    if (where.status) { conditions.push('l.status = ?'); params.push(where.status); }
    if (where.serviceRequired) { conditions.push('l.serviceRequired = ?'); params.push(where.serviceRequired); }
    if (where.leadSource) { conditions.push('l.leadSource = ?'); params.push(where.leadSource); }
    if (where.priority) { conditions.push('l.priority = ?'); params.push(where.priority); }
    if (where.assignedTo) { conditions.push('l.assignedTo = ?'); params.push(where.assignedTo); }
    const whereClause = conditions.join(' AND ');

    const companies = await sequelize.query(
      `SELECT l.id, l.companyName, l.status,
              COALESCE(COUNT(f.id), 0) as totalFollowups,
              MAX(f.followUpDate) as latestActivity
       FROM leads l
       LEFT JOIN follow_up_history f ON f.lead = l.id
       WHERE ${whereClause}
       GROUP BY l.id, l.companyName, l.status
       ORDER BY totalFollowups DESC
       LIMIT 10`,
      { replacements: params, type: sequelize.QueryTypes.SELECT }
    );

    res.json(companies.map(c => ({
      companyName: c.companyName,
      totalFollowups: parseInt(c.totalFollowups) || 0,
      latestActivity: c.latestActivity || null,
      status: c.status
    })));
  } catch (error) {
    next(error);
  }
};

exports.getTeamPerformance = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const conditions = ['1=1'];
    const params = [];
    if (where.status) { conditions.push('l.status = ?'); params.push(where.status); }
    if (where.serviceRequired) { conditions.push('l.serviceRequired = ?'); params.push(where.serviceRequired); }
    if (where.leadSource) { conditions.push('l.leadSource = ?'); params.push(where.leadSource); }
    if (where.priority) { conditions.push('l.priority = ?'); params.push(where.priority); }
    if (where.assignedTo) { conditions.push('l.assignedTo = ?'); params.push(where.assignedTo); }
    const whereClause = conditions.join(' AND ');

    const team = await sequelize.query(
      `SELECT u.id, u.name,
              COUNT(l.id) as assignedLeads,
              SUM(CASE WHEN l.status = 'Approved' THEN 1 ELSE 0 END) as closedLeads,
              SUM(CASE WHEN l.status = 'Waiting' THEN 1 ELSE 0 END) as pendingLeads,
              SUM(CASE WHEN l.status = 'Rejected' THEN 1 ELSE 0 END) as rejectedLeads
       FROM users u
       LEFT JOIN leads l ON l.assignedTo = u.id AND (${whereClause})
       GROUP BY u.id, u.name
       HAVING COUNT(l.id) > 0`,
      { replacements: params, type: sequelize.QueryTypes.SELECT }
    );

    res.json(team.map(t => {
      const assigned = parseInt(t.assignedLeads);
      const closed = parseInt(t.closedLeads);
      const decided = closed + parseInt(t.rejectedLeads);
      return {
        userId: t.id,
        name: t.name,
        assignedLeads: assigned,
        closedLeads: closed,
        pendingLeads: parseInt(t.pendingLeads),
        conversionRate: decided > 0 ? parseFloat(((closed / decided) * 100).toFixed(1)) : 0
      };
    }));
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const activities = await ActivityLog.findAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Lead, attributes: ['id', 'companyName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

exports.exportAnalyticsCSV = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const { startOfToday, endOfToday, startOfMonth } = getDateRange(req.query);

    const [totalLeads, waitingLeads, approvedLeads, rejectedLeads, totalFollowups] = await Promise.all([
      Lead.count({ where }),
      Lead.count({ where: { ...where, status: 'Waiting' } }),
      Lead.count({ where: { ...where, status: 'Approved' } }),
      Lead.count({ where: { ...where, status: 'Rejected' } }),
      FollowUpHistory.count()
    ]);

    const decided = approvedLeads + rejectedLeads;
    const conversionRate = decided > 0 ? ((approvedLeads / decided) * 100).toFixed(1) : 0;

    const services = await Lead.findAll({
      attributes: ['serviceRequired', [fn('COUNT', col('id')), 'total']],
      where, group: ['serviceRequired'], raw: true
    });

    const sources = await Lead.findAll({
      attributes: ['leadSource', [fn('COUNT', col('id')), 'count']],
      where, group: ['leadSource'], raw: true
    });

    const escapeCSV = (v) => {
      if (v == null) return '';
      const s = String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };

    let csv = 'Section,Metric,Value\n';
    csv += `Overview,Total Leads,${totalLeads}\n`;
    csv += `Overview,Waiting Leads,${waitingLeads}\n`;
    csv += `Overview,Approved Leads,${approvedLeads}\n`;
    csv += `Overview,Rejected Leads,${rejectedLeads}\n`;
    csv += `Overview,Conversion Rate,${conversionRate}%\n`;
    csv += `Overview,Total Follow-ups,${totalFollowups}\n\n`;

    csv += 'Section,Service,Total Leads\n';
    services.forEach(s => { csv += `Services,${escapeCSV(s.serviceRequired)},${s.total}\n`; });
    csv += '\nSection,Source,Count\n';
    sources.forEach(s => { csv += `Sources,${escapeCSV(s.leadSource)},${s.count}\n`; });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

exports.exportAnalyticsExcel = async (req, res, next) => {
  try {
    const where = buildWhere(req.query);
    const { startOfToday, endOfToday, startOfMonth } = getDateRange(req.query);
    const ExcelJS = require('exceljs');

    const [totalLeads, waitingLeads, approvedLeads, rejectedLeads, totalFollowups] = await Promise.all([
      Lead.count({ where }),
      Lead.count({ where: { ...where, status: 'Waiting' } }),
      Lead.count({ where: { ...where, status: 'Approved' } }),
      Lead.count({ where: { ...where, status: 'Rejected' } }),
      FollowUpHistory.count()
    ]);

    const services = await Lead.findAll({
      attributes: ['serviceRequired', [fn('COUNT', col('id')), 'total']],
      where, group: ['serviceRequired'], order: [[literal('COUNT(id)'), 'DESC']], raw: true
    });

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('Analytics Overview');

    ws.columns = [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 20 }
    ];
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };

    ws.addRow({ metric: 'Total Leads', value: totalLeads });
    ws.addRow({ metric: 'Waiting Leads', value: waitingLeads });
    ws.addRow({ metric: 'Approved Leads', value: approvedLeads });
    ws.addRow({ metric: 'Rejected Leads', value: rejectedLeads });
    ws.addRow({ metric: 'Conversion Rate', value: `${approvedLeads + rejectedLeads > 0 ? ((approvedLeads / (approvedLeads + rejectedLeads)) * 100).toFixed(1) : 0}%` });
    ws.addRow({ metric: 'Total Follow-ups', value: totalFollowups });

    ws.addRow({});
    ws.addRow({ metric: 'Service' });
    ws.addRow({ metric: 'Total Leads' });
    ws.getRow(8).font = { bold: true };
    services.forEach(s => ws.addRow({ metric: s.serviceRequired, value: parseInt(s.total) }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${new Date().toISOString().split('T')[0]}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

exports.getFilters = async (req, res, next) => {
  try {
    const [users, services, sources] = await Promise.all([
      User.findAll({ attributes: ['id', 'name'], where: { isActive: true } }),
      Lead.findAll({ attributes: [[fn('DISTINCT', col('serviceRequired')), 'service']], raw: true }),
      Lead.findAll({ attributes: [[fn('DISTINCT', col('leadSource')), 'source']], raw: true })
    ]);
    res.json({
      users: users.map(u => ({ id: u.id, name: u.name })),
      services: services.map(s => s.service).filter(Boolean).sort(),
      sources: sources.map(s => s.source).filter(Boolean).sort()
    });
  } catch (error) {
    next(error);
  }
};
