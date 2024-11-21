const db = require("../models");
const Project = db.project;
const Op = db.Sequelize.Op;
// Create and Save a new Project
exports.create = (req, res) => {
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
  // Save Project in the database
  Project.create(project)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project.",
      });
    });
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
// Find a single Project with an id
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
// Find a single Resume with an id
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
// Update a Resume by the id in the request
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
          message: `Cannot update Project with id=${id}. Maybe Resume was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Resume with id=" + id,
      });
    });
};
// Delete a Resume with the specified id in the request
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
// Delete all Resumes from the database.
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