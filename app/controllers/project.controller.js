const db = require("../models");
const Project = db.project;
const Op = db.Sequelize.Op;
// Create and Save a new Project
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.projectName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Project
  const project = {
    projectName: req.body.projectName,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    userId: req.body.userId,
  };


  const resumeId = req.body.resumeId;

  console.log("Creating project with projectName: " + project.projectName);
  // Trying to save project in the database
  try {
    let projectInstance = await Project.create(project);
    await projectInstance.addResume(resumeId);
    res.send(projectInstance);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the project.",
    });
  }
};


// Retrieve all Projects from the database.
exports.findAll = (req, res) => {
  const projectName = req.query.projectName;
  var condition = projectName ? { title: { [Op.like]: `%${projectName}%` } } : null;
  Project.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving resumes.",
      });
    });
};
// Find a Project for a user with an id
exports.findAllForUser = (req, res) => {
  console.log("Finding all project for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Project.findAll({ where: { userId: userId } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find  for user with id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Projects for user with id=" + userId,
      });
    });
};
// Find a single Project with an id
exports.findOne = (req, res) => {
  console.log("Finding project with id: " + req.params.id);

  const id = req.params.id;
  Project.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Project with id=" + id,
      });
    });
};
// Update a Project by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log("Updating project with id: " + id);
  
  Project.update(req.body, {
    where: { projectId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Project was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Project with id=" + id,
      });
    });
};

 //Update relation for project

 exports.updateRelation = async (req, res) => {
  const id = req.params.id;
  console.log("Updating relationship of project with id: " + id);

  try {
    // Find the project instance by primary key
    const projectInstance = await Project.findByPk(id);

    if (!projectInstance) {
      res.status(404).send({
        message: `project with id=${id} not found.`,
      });
      return;
    }

    // Handle removeResumeId
    if (req.body.removeResumeId) {
      await projectInstance.removeResume(req.body.removeResumeId);
      res.send({
        message: `Successfully removed Resume with id=${req.body.removeResumeId} from project with id=${id}.`,
      });
      return;
    }

    // Handle addResumeId
    if (req.body.addResumeId) {
      await projectInstance.addResume(req.body.addResumeId);
      res.send({
        message: `Successfully added Resume with id=${req.body.addResumeId} to project with id=${id}.`,
      });
      return;
    }

    // If neither addResumeId nor removeResumeId is provided
    res.status(400).send({
      message: "Invalid request body! Need addResumeId or removeResumeId.",
    });

  } catch (err) {
    // Handle errors
    res.status(500).send({
      message:
        err.message || `Some error occurred while updating the relationship for project with id=${id}.`,
    });
  }
};




// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Project.destroy({
    where: { projectId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Project was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Project with id=${id}. Maybe Resume was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Resume with id=" + id,
      });
    });
};
// Delete all Projects from the database.
exports.deleteAll = (req, res) => {
  Resume.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Resumes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all resumes.",
      });
    });
};