const { Op, fn, col, literal } = require('sequelize');
const { sequelize } = require('../config/db');
const { Lead, ActivityLog, User } = require('../models');

exports.getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    const [
      totalLeads,
      waitingLeads,
      approvedLeads,
      rejectedLeads,
      todayFollowUps,
      overdueFollowUps,
      upcomingFollowUps,
      recentLeads,
      recentActivities,
      statusStats,
      monthlyLeads,
      priorityStats
    ] = await Promise.all([
      Lead.count(),
      Lead.count({ where: { status: 'Waiting' } }),
      Lead.count({ where: { status: 'Approved' } }),
      Lead.count({ where: { status: 'Rejected' } }),
      Lead.count({
        where: {
          nextFollowUpDate: { [Op.gte]: startOfToday, [Op.lt]: endOfToday }
        }
      }),
      Lead.count({
        where: {
          status: 'Waiting',
          nextFollowUpDate: { [Op.lt]: startOfToday }
        }
      }),
      Lead.count({
        where: {
          status: 'Waiting',
          nextFollowUpDate: { [Op.gte]: endOfToday }
        }
      }),
      Lead.findAll({
        include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      ActivityLog.findAll({
        include: [
          { model: User, attributes: ['id', 'name'] },
          { model: Lead, attributes: ['id', 'companyName'] }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      }),
      Lead.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status']
      }),
      Lead.findAll({
        attributes: [
          [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), '_id'],
          [fn('COUNT', col('id')), 'count']
        ],
        group: [literal('DATE_FORMAT(createdAt, \'%Y-%m\')')],
        order: [literal('DATE_FORMAT(createdAt, \'%Y-%m\') ASC')],
        limit: 12
      }),
      Lead.findAll({
        attributes: ['priority', [fn('COUNT', col('id')), 'count']],
        group: ['priority']
      })
    ]);

    res.json({
      stats: {
        totalLeads,
        waitingLeads,
        approvedLeads,
        rejectedLeads,
        todayFollowUps,
        overdueFollowUps,
        upcomingFollowUps
      },
      recentLeads,
      recentActivities,
      charts: {
        statusStats: statusStats.reduce((acc, s) => {
          acc[s.status.toLowerCase()] = parseInt(s.getDataValue('count'));
          return acc;
        }, {}),
        monthlyLeads: monthlyLeads.map(m => ({
          _id: m.getDataValue('_id'),
          count: parseInt(m.getDataValue('count'))
        })),
        priorityStats: priorityStats.reduce((acc, p) => {
          acc[p.priority.toLowerCase()] = parseInt(p.getDataValue('count'));
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};
