const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAssignedProjects,
  updateAssignedProjectStatus,
} = require('../controllers/staffController');

const router = express.Router();

router.use(protect, authorize('STAFF'));

router.get('/assigned', getAssignedProjects);
router.patch('/:id/status', updateAssignedProjectStatus);

module.exports = router;
