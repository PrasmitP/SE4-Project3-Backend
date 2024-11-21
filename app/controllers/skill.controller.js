const { propfind } = require("../../server");
const db = require("../models");
const Skill = db.skill;
const Op = db.Sequelize.Op;
// Create and Save a new Skill
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Skill
  const skill = {
    title: req.body.title,
    isLanguage: req.body.isLanguage,
    proficiencyLevel: req.body.proficiencyLevel,
    userId: req.body.userId,
  };

  const resumeId = req.body.resumeId;

  console.log("Creating Skill with companyName: " + skill.companyName);
  // Trying to save Skill in the database
  try {
    let skillInstance = await Skill.create(skill);
    await skillInstance.addResume(resumeId);
    res.send(skillInstance);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Skill.",
    });
  }
};

// Retrieve all Skills from the database.
exports.findAll = (req, res) => {
  const institutionName = req.query.institutionName;
  var condition = institutionName ? { title: { [Op.like]: `%${institutionName}%` } } : null;
  Skill.findAll({ where: condition })
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

// Find all skills for user id
exports.findAllForUser = (req, res) => {
  console.log("Finding all skill for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Skill.findAll({ where: { userId: userId } })
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
  console.log("Finding skill with id: " + req.params.id);

  const id = req.params.id;
  Skill.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Skill with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Skill with id=" + id,
      });
    });
};

// Update a Resume by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  console.log("Updating skill with id: " + id);
  Skill.update(req.body, {
    where: { skillId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Skill was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Skill with id=${id}. Maybe Resume was not found or req.body is empty!`,
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
  console.log("Updating relationship of skill with id: " + id);

  try {
    // Find the Skill instance by primary key
    const skillInstance = await Skill.findByPk(id);

    if (!skillInstance) {
      res.status(404).send({
        message: `Skill with id=${id} not found.`,
      });
      return;
    }

    // Handle removeResumeId
    if (req.body.removeResumeId) {
      await skillInstance.removeResume(req.body.removeResumeId);
      res.send({
        message: `Successfully removed Resume with id=${req.body.removeResumeId} from Skill with id=${id}.`,
      });
      return;
    }

    // Handle addResumeId
    if (req.body.addResumeId) {
      await skillInstance.addResume(req.body.addResumeId);
      res.send({
        message: `Successfully added Resume with id=${req.body.addResumeId} to Skill with id=${id}.`,
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
        err.message || `Some error occurred while updating the relationship for Skill with id=${id}.`,
    });
  }
};

// Delete a Resume with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Skill.destroy({
    where: { skillId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Skill was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Skill with id=${id}. Maybe Resume was not found!`,
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
