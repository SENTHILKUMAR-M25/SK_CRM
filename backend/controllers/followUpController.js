const { Op } = require('sequelize');
const { User, Lead, FollowUpHistory, ActivityLog } = require('../models');

exports.getHistory = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const history = await FollowUpHistory.findAll({
      where: { lead: req.params.id },
      include: [{ model: User, as: 'createdByUser', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ history });
  } catch (error) {
    next(error);
  }
};

exports.addFollowUp = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const { followUpDate, followUpTime, status, remark, nextFollowUpDate, nextFollowUpTime } = req.body;

    if (!remark || !followUpDate) {
      return res.status(400).json({ message: 'Remark and follow-up date are required' });
    }

    const newRemark = remark.trim();
    const previousRemark = lead.remark;

    const updateData = {};
    if (newRemark !== previousRemark) {
      updateData.remark = newRemark;
    }

    if (nextFollowUpDate) {
      updateData.nextFollowUpDate = nextFollowUpDate;
      updateData.nextFollowUpTime = nextFollowUpTime || '';
      updateData.status = 'Waiting';
    } else {
      updateData.nextFollowUpDate = null;
      updateData.nextFollowUpTime = '';
    }

    if (lead.status === 'Waiting' && !nextFollowUpDate) {
      updateData.status = 'Follow-up';
    }

    await Lead.update(updateData, { where: { id: req.params.id } });

    const historyEntry = await FollowUpHistory.create({
      lead: req.params.id,
      followUpDate,
      followUpTime: followUpTime || '',
      status: status || 'Follow-up',
      remark: newRemark,
      nextFollowUpDate: nextFollowUpDate || null,
      nextFollowUpTime: nextFollowUpTime || '',
      createdBy: req.user.id
    });

    await ActivityLog.create({
      lead: req.params.id,
      user: req.user.id,
      action: 'Follow-up Added',
      description: `Follow-up added for ${lead.companyName}: ${newRemark.substring(0, 100)}`,
      details: { status, followUpDate }
    });

    const updatedLead = await Lead.findByPk(req.params.id, {
      include: [{ model: User, as: 'assignedToUser', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json({ message: 'Follow-up added successfully', history: historyEntry, lead: updatedLead });
  } catch (error) {
    next(error);
  }
};
