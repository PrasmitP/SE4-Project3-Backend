const db = require("../models");
const Experience = db.experience;
const Op = db.Sequelize.Op;
// Create and Save a new Experience
exports.create = async (req, res) => {
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

  const resumeId = req.body.resumeId;

  console.log("Creating Experience with companyName: " + experience.companyName);
  // Trying to save Experience in the database
  try {
    let experienceInstance = await Experience.create(experience);
    await experienceInstance.addResume(resumeId);
    res.send(experienceInstance);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Experience.",
    });
  }
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

// Find all Experience for user id 
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

// Find a single Experience with an id
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

// Update an Experience by the id in the request
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

exports.updateRelation = async (req, res) => {
  const id = req.params.id;
  console.log("Updating relationship of experience with id: " + id);

  try {
    // Find the Experience instance by primary key
    const experienceInstance = await Experience.findByPk(id);

    if (!experienceInstance) {
      res.status(404).send({
        message: `Experience with id=${id} not found.`,
      });
      return;
    }

    // Handle removeResumeId
    if (req.body.removeResumeId) {
      await experienceInstance.removeResume(req.body.removeResumeId);
      res.send({
        message: `Successfully removed Resume with id=${req.body.removeResumeId} from Experience with id=${id}.`,
      });
      return;
    }

    // Handle addResumeId
    if (req.body.addResumeId) {
      await experienceInstance.addResume(req.body.addResumeId);
      res.send({
        message: `Successfully added Resume with id=${req.body.addResumeId} to Experience with id=${id}.`,
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
        err.message || `Some error occurred while updating the relationship for Experience with id=${id}.`,
    });
  }
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
