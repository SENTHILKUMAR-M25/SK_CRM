const User = require('./User');
const Lead = require('./Lead');
const FollowUpHistory = require('./FollowUpHistory');
const ActivityLog = require('./ActivityLog');
const Document = require('./Document');

User.hasMany(Lead, { foreignKey: 'assignedTo' });
Lead.belongsTo(User, { as: 'assignedToUser', foreignKey: 'assignedTo' });

Lead.hasMany(FollowUpHistory, { foreignKey: 'lead', onDelete: 'CASCADE' });
FollowUpHistory.belongsTo(Lead, { foreignKey: 'lead' });
FollowUpHistory.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });

Lead.hasMany(ActivityLog, { foreignKey: 'lead', onDelete: 'CASCADE' });
ActivityLog.belongsTo(Lead, { foreignKey: 'lead' });
ActivityLog.belongsTo(User, { foreignKey: 'user' });

Lead.hasMany(Document, { foreignKey: 'lead', onDelete: 'CASCADE' });
Document.belongsTo(Lead, { foreignKey: 'lead' });

module.exports = { User, Lead, FollowUpHistory, ActivityLog, Document };
