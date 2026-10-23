
const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

function projectResponse(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    type: project.type,
    budget: project.budget,
    deadline: project.deadline,
    status: project.status,
    client: project.client
      ? {
          id: project.client._id,
          name: project.client.name,
          email: project.client.email,
        }
      : null,
    assignedStaff: project.assignedStaff
      ? {
          id: project.assignedStaff._id,
          name: project.assignedStaff.name,
          email: project.assignedStaff.email,
        }
      : null,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// Admin can view all projects.
exports.getAllProjects = async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name email')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects.map(projectResponse),
    });
  } catch (error) {
    console.error('Admin get projects error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to load projects.',
    });
  }
};

// Admin can list active staff accounts.
exports.getStaffUsers = async (_req, res) => {
  try {
    const staff = await User.find({
      role: 'STAFF',
      isActive: true,
    })
      .select('name email company')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error('Admin get staff error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to load staff accounts.',
    });
  }
};

// Admin can assign or unassign a project.
exports.assignProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    let staff = null;

    // A null or empty staffId removes the current assignment.
    if (staffId !== null && staffId !== '') {
      if (!mongoose.isValidObjectId(staffId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid staff ID.',
        });
      }

      staff = await User.findOne({
        _id: staffId,
        role: 'STAFF',
        isActive: true,
      });

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Active staff account not found.',
        });
      }
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    project.assignedStaff = staff ? staff._id : null;
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('client', 'name email')
      .populate('assignedStaff', 'name email');

    return res.status(200).json({
      success: true,
      message: staff
        ? 'Project assigned successfully.'
        : 'Project unassigned successfully.',
      project: projectResponse(updatedProject),
    });
  } catch (error) {
    console.error('Admin assign project error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to update project assignment.',
    });
  }
};

// Admin can create staff accounts.
exports.createStaffUser = async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must contain between 2 and 100 characters.',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const staff = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      company:
        typeof company === 'string' && company.trim()
          ? company.trim()
          : undefined,
      phone:
        typeof phone === 'string' && phone.trim()
          ? phone.trim()
          : undefined,
      role: 'STAFF',
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Staff account created successfully.',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        company: staff.company,
        phone: staff.phone,
        role: staff.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    console.error('Admin create staff error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to create staff account.',
    });
  }
};

 // Admin can view and filter all user accounts.
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role) {
      const normalizedRole = role.toUpperCase();

      if (!['CLIENT', 'STAFF', 'ADMIN'].includes(normalizedRole)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role filter.',
        });
      }

      filter.role = normalizedRole;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    } else if (status && status !== 'all') {
      return res.status(400).json({
        success: false,
        message: 'Invalid account status filter.',
      });
    }

    if (typeof search === 'string' && search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      const searchRegex = new RegExp(escapedSearch, 'i');

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex },
      ];
    }

    const users = await User.find(filter)
      .select('name email role company phone isActive createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Admin get all users error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to load user accounts.',
    });
  }
};
