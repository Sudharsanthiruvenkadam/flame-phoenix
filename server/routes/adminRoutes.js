
const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  getAllProjects,
  getStaffUsers,
  getAllUsers,
  createStaffUser,
  assignProject,
} = require("../controllers/adminController");

const router = express.Router();

// Protect every admin route.
router.use(protect, authorize("ADMIN"));

// Get all projects.
router.get("/projects", getAllProjects);

// Get all users: clients, staff, and admins.
router.get("/users", getAllUsers);

// Get active staff accounts for project assignment.
router.get("/staff", getStaffUsers);

// Create a staff account.
router.post("/staff", createStaffUser);

// Assign or unassign a project to/from staff.
router.patch("/projects/:id/assign", assignProject);

module.exports = router;
