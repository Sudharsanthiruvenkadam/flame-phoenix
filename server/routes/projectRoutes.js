const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createProject,
  getMyProjects,
  getMyProjectById,
} = require('../controllers/projectController');

const router = express.Router();

router.use(protect, authorize('CLIENT'));

router.post('/', createProject);
router.get('/my', getMyProjects);
router.get('/:id', getMyProjectById);

module.exports = router;

