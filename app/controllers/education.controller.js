const db = require("../models");
const Education = db.education;
const Op = db.Sequelize.Op;
// Create and Save a new Education
exports.create = (req, res) => {
  // Validate request
  if (!req.body.institutionName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create an Education
  const education = {
    institutionName: req.body.institutionName,
    city: req.body.city,
    state: req.body.state,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    bachalorName: req.body.bachalorName,
    gpa: req.body.gpa,
    userId: req.body.userId,
  };
  // Save Resume in the database
  Education.create(education)
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
// Retrieve all Educations from the database.
exports.findAll = (req, res) => {
  const institutionName = req.query.institutionName;
  var condition = institutionName ? { title: { [Op.like]: `%${institutionName}%` } } : null;
  Education.findAll({ where: condition })
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

// Find a single Education with an id
exports.findAllForUser = (req, res) => {
  console.log("Finding all education for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Education.findAll({ where: { userId: userId } })
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
  console.log("Finding education with id: " + req.params.id);

  const id = req.params.id;
  Education.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Education with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Education with id=" + id,
      });
    });
};
// Update a Resume by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log("Updating education with id: " + id);
  Education.update(req.body, {
    where: { educationId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Education was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Education with id=${id}. Maybe Resume was not found or req.body is empty!`,
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
  Education.destroy({
    where: { educationId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Education was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Education with id=${id}. Maybe Resume was not found!`,
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
