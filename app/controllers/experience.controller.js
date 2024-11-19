const db = require("../models");
const Experience = db.experience;
const Op = db.Sequelize.Op;
// Create and Save a new Experience
exports.create = (req, res) => {
  // Validate request
  if (!req.body.companyName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create an Experience
  const experience = {
    companyName: req.body.companyName,
    city: req.body.city,
    state: req.body.state,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    jobRole: req.body.jobRole,
    userId: req.body.userId,
  };
  // Save Experience in the database
  Experience.create(experience)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Resume.",
      });
    });
};
// Retrieve all Experiences from the database.
exports.findAll = (req, res) => {
  const institutionName = req.query.institutionName;
  var condition = institutionName ? { title: { [Op.like]: `%${institutionName}%` } } : null;
  Experience.findAll({ where: condition })
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

// Find a single Experience with an id
exports.findAllForUser = (req, res) => {
  console.log("Finding all experience for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Experience.findAll({ where: { userId: userId } })
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
          "Error retrieving Resumes for user with id=" + userId,
      });
    });
};
// Find a single Resume with an id
exports.findOne = (req, res) => {
  console.log("Finding experience with id: " + req.params.id);

  const id = req.params.id;
  Experience.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Experience with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Experience with id=" + id,
      });
    });
};
// Update a Resume by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log("Updating experience with id: " + id);
  Experience.update(req.body, {
    where: { experienceId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Experience was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Experience with id=${id}. Maybe Resume was not found or req.body is empty!`,
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
  Experience.destroy({
    where: { experienceId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Experience was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Experience with id=${id}. Maybe Resume was not found!`,
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
