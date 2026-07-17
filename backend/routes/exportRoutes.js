const express = require('express');
const router = express.Router();
const { exportCSV, exportExcel } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.get('/csv', protect, exportCSV);
router.get('/excel', protect, exportExcel);

module.exports = router;
