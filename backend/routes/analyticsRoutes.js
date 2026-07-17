const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getOverview, getMonthly, getStatus, getFollowups,
  getServices, getSources, getPriorities, getTopCompanies,
  getTeamPerformance, getRecentActivity, getFilters,
  exportAnalyticsCSV, exportAnalyticsExcel
} = require('../controllers/analyticsController');

router.get('/overview', protect, getOverview);
router.get('/monthly', protect, getMonthly);
router.get('/status', protect, getStatus);
router.get('/followups', protect, getFollowups);
router.get('/services', protect, getServices);
router.get('/sources', protect, getSources);
router.get('/priorities', protect, getPriorities);
router.get('/top-companies', protect, getTopCompanies);
router.get('/team-performance', protect, getTeamPerformance);
router.get('/recent-activity', protect, getRecentActivity);
router.get('/filters', protect, getFilters);
router.get('/export/csv', protect, exportAnalyticsCSV);
router.get('/export/excel', protect, exportAnalyticsExcel);

module.exports = router;
