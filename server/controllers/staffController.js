const mongoose = require('mongoose');
const Project = require('../models/Project');
const { PROJECT_STATUS } = require('../constants');

const allowedStaffStatuses = [
  PROJECT_STATUS.PLANNING,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.TESTING,
  PROJECT_STATUS.CLIENT_REVIEW,
  PROJECT_STATUS.ON_HOLD,
  PROJECT_STATUS.CHANGES_REQUESTED,
];

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
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// Staff can view only projects assigned to their account.
exports.getAssignedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      assignedStaff: req.user._id,
    })
      .populate('client', 'name email')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects.map(projectResponse),
    });
  } catch (error) {
    console.error('Get assigned projects error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to load assigned projects.',
    });
  }
};

// Staff can update status only on projects assigned to them.
exports.updateAssignedProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    if (!allowedStaffStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'This status cannot be selected by staff.',
      });
    }

    const project = await Project.findOne({
      _id: id,
      assignedStaff: req.user._id,
    }).populate('client', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Assigned project not found.',
      });
    }

    project.status = status;
    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project status updated successfully.',
      project: projectResponse(project),
    });
  } catch (error) {
    console.error('Update assigned project status error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to update project status.',
    });
  }
};
