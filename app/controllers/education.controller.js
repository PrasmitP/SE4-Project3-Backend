const db = require("../models");
const Education = db.education;
const Op = db.Sequelize.Op;
// Create and Save a new Education
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.institutionName) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create an Education JS Object
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

  const resumeId = req.body.resumeId;

  console.log("Creating Education with institutionName: " + education.institutionName);
  // Trying to save Education in the database
  try {
    let educationInstance = await Education.create(education);
    await educationInstance.addResume(resumeId);
    res.send(educationInstance);
  }
  catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Education.",
    });
  }
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

// Find an Education for user with an id
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
          "Error retrieving Educations for user with id=" + userId,
      });
    });
};

// Find a single Education with an id
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

// Update an Education by the id in the request
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
          message: `Cannot update Education with id=${id}. Maybe Education was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Education with id=" + id,
      });
    });
};

exports.updateRelation = async (req, res) => {
  const id = req.params.id;
  console.log("Updating relationship of education with id: " + id);

  try {
    // Find the Education instance by primary key
    const educationInstance = await Education.findByPk(id);

    if (!educationInstance) {
      res.status(404).send({
        message: `Education with id=${id} not found.`,
      });
      return;
    }

    // Handle removeResumeId
    if (req.body.removeResumeId) {
      await educationInstance.removeResume(req.body.removeResumeId);
      res.send({
        message: `Successfully removed Resume with id=${req.body.removeResumeId} from Education with id=${id}.`,
      });
      return;
    }

    // Handle addResumeId
    if (req.body.addResumeId) {
      await educationInstance.addResume(req.body.addResumeId);
      res.send({
        message: `Successfully added Resume with id=${req.body.addResumeId} to Education with id=${id}.`,
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
        err.message || `Some error occurred while updating the relationship for Education with id=${id}.`,
    });
  }
};

// Delete an Education with the specified id in the request
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
          message: `Cannot delete Education with id=${id}. Maybe Education was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Could not delete Education with id=" + id,
      });
    });
};
// Delete all Educations from the database.
exports.deleteAll = (req, res) => {
  Education.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Educations were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all resumes.",
      });
    });
};
