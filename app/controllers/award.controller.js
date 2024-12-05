const db = require("../models");
const Award = db.award;
const Op = db.Sequelize.Op;
// Create and Save a new Award
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create an Award
  const award = {
    title: req.body.title,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    description: req.body.description,
    userId: req.body.userId,
  };

  const resumeId = req.body.resumeId;

  console.log("Creating Award with title: " + award.title);
  // Trying to save Award in the database
  try {
    let awardInstance = await Award.create(award);
    await awardInstance.addResume(resumeId);
    res.send(awardInstance);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Award.",
    });
  }
};

// Retrieve all awards from the database.
exports.findAll = (req, res) => {
  const awardName = req.query.awardName;
  var condition = awardName ? { title: { [Op.like]: `%${awardName}%` } } : null;
  Award.findAll({ where: condition })
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

// Find an Award for a user with an id
exports.findAllForUser = (req, res) => {
  console.log("Finding all award for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Award.findAll({ where: { userId: userId } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Award for user with id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Awards for user with id=" + userId,
      });
    });
};

// Find a single Award with an id
exports.findOne = (req, res) => {
  console.log("Finding award with id: " + req.params.awardId);

  const awardId = req.params.awardId;
  Award.findByPk(awardId)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Award with id=${awardId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Award with id=" + awardId,
      });
    });
};

// Update an Award by the id in the request
exports.update = (req, res) => {
  const awardId = req.params.awardId;
  console.log("Updating award with id: " + awardId);

  Award.update(req.body, {
    where: { awardId: awardId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Award was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Award with id=${awardId}. Maybe Resume was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Resume with id=" + awardId,
      });
    });
};

//Update relation for award
exports.updateRelation = async (req, res) => {
  const awardId = req.params.awardId;
  console.log("Updating relationship of award with id: " + awardId);

  try {
    // Find the Award instance by primary key
    const awardInstance = await Award.findByPk(awardId);

    if (!awardInstance) {
      res.status(404).send({
        message: `Award with id=${awardId} not found.`,
      });
      return;
    }

    // Handle removeResumeId
    if (req.body.removeResumeId) {
      await awardInstance.removeResume(req.body.removeResumeId);
      res.send({
        message: `Successfully removed Resume with id=${req.body.removeResumeId} from Award with id=${awardId}.`,
      });
      return;
    }

    // Handle addResumeId
    if (req.body.addResumeId) {
      await awardInstance.addResume(req.body.addResumeId);
      res.send({
        message: `Successfully added Resume with id=${req.body.addResumeId} to Award with id=${awardId}.`,
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
        err.message || `Some error occurred while updating the relationship for Award with id=${awardId}.`,
    });
  }
};

// Delete an Award with the specified id in the request
exports.delete = (req, res) => {
  const awardId = req.params.awardId;
  Award.destroy({
    where: { awardId: awardId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Award was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Award with id=${awardId}. Maybe Resume was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Resume with id=" + awardId,
      });
    });
};

