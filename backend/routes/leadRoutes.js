const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getLeads, getLead, createLead, updateLead, deleteLead,
  uploadDocument, deleteDocument, getFilterOptions
} = require('../controllers/leadController');
const { getHistory, addFollowUp } = require('../controllers/followUpController');

router.use(protect);

router.get('/', getLeads);
router.get('/filters', getFilterOptions);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

router.get('/:id/history', getHistory);
router.post('/:id/history', addFollowUp);

router.post('/:id/documents', upload.single('file'), uploadDocument);
router.delete('/:id/documents/:docId', deleteDocument);

module.exports = router;
