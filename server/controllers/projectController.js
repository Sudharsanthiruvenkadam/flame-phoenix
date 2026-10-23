const Project = require('../models/Project');
const { PROJECT_TYPES } = require('../constants');

function projectResponse(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    type: project.type,
    budget: project.budget,
    deadline: project.deadline,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

// Create a project for the currently authenticated client.
exports.createProject = async (req, res) => {
  try {
    const { name, description, type, budget, deadline } = req.body;

    if (
      typeof name !== 'string' ||
      name.trim().length < 3 ||
      typeof description !== 'string' ||
      description.trim().length < 20 ||
      !PROJECT_TYPES.includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid project name, description and project type.',
      });
    }

    let parsedBudget = null;

    if (budget !== undefined && budget !== null && budget !== '') {
      parsedBudget = Number(budget);

      if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
        return res.status(400).json({
          success: false,
          message: 'Budget must be a valid non-negative number.',
        });
      }
    }

    let parsedDeadline = null;

    if (deadline) {
      parsedDeadline = new Date(deadline);

      if (Number.isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Enter a valid project deadline.',
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (parsedDeadline < today) {
        return res.status(400).json({
          success: false,
          message: 'The deadline cannot be in the past.',
        });
      }
    }

    const project = await Project.create({
      name: name.trim(),
      description: description.trim(),
      type,
      budget: parsedBudget,
      deadline: parsedDeadline,
      client: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Project submitted successfully.',
      project: projectResponse(project),
    });
  } catch (error) {
    console.error('Create project error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to submit the project. Please try again.',
    });
  }
};

// Clients can retrieve only their own projects.
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      client: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects: projects.map(projectResponse),
    });
  } catch (error) {
    console.error('Get projects error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to load your projects.',
    });
  }
};

// Retrieve one project, but only when it belongs to the signed-in client.
exports.getMyProjectById = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const projectId = req.params.id;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID.',
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      client: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    return res.status(200).json({
      success: true,
      project: projectResponse(project),
    });
  } catch (error) {
    console.error('Get project details error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to load project details.',
    });
  }
};
