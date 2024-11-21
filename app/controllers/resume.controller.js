const db = require("../models");
const Resume = db.resume;
const Op = db.Sequelize.Op;
// Create and Save a new Resume
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Resume
  const resume = {
    title: req.body.title,
    template: req.body.template,
    summary: req.body.summary,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
    userId: req.body.userId,
  };
  // Save Resume in the database
  Resume.create(resume)
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
// Retrieve all Resumes from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Resume.findAll({ where: condition })
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

// Find a single Resume with an id
exports.findAllForUser = (req, res) => {
  console.log("Finding all resumes for user with id: " + req.params.userId);
  const userId = req.params.userId;
  Resume.findAll({ where: { userId: userId } })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Resumes for user with id=${userId}.`,
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
  console.log("Finding resume with id: " + req.params.id);

  const id = req.params.id;
  Resume.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Resume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Resume with id=" + id,
      });
    });
};
// Update a Resume by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Resume.update(req.body, {
    where: { resumeId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Resume was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Resume with id=${id}. Maybe Resume was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Resume with id=" + id,
      });
    });
};

// Get all educations for a resume
exports.getEducations = (req, res) => {
  console.log("Finding all educations for resume with id: " + req.params.id);
  const id = req.params.id;
  Resume.findByPk(id, { include: ["education"] })
    .then((data) => {
      if (data) {
        res.send(data.education);
      } else {
        res.status(404).send({
          message: `Cannot find Educations for Resume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Educations for Resume with id=" + id,
      });
    });
}

// Add Educations to a resume
exports.addEducations = async (req, res) => {
  const resumeId = req.params.id;
  console.log("Adding education to resume with id: " + resumeId);
  try {
    const resumeInstance = await Resume.findByPk(resumeId);
    const educationIds = req.body.educationId
    await resumeInstance.addEducation(educationIds);
    res.send({ message: "Educations added successfully." });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error adding education to resume with id=" + resumeId,
    });
  }
};

// Get all experiences for a resume
exports.getExperiences = (req, res) => {
  console.log("Finding all educations for resume with id: " + req.params.id);
  const id = req.params.id;
  Resume.findByPk(id, { include: ["experiences"] })
    .then((data) => {
      if (data) {
        res.send(data.experiences);
      } else {
        res.status(404).send({
          message: `Cannot find Experiences for Resume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Experiences for Resume with id=" + id,
      });
    });
}

// Get all skills for a resume
exports.getSkills = (req, res) => {
  console.log("Finding all skills for resume with id: " + req.params.id);
  const id = req.params.id;
  Resume.findByPk(id, { include: ["skills"] })
    .then((data) => {
      if (data) {
        res.send(data.skills);
      } else {
        res.status(404).send({
          message: `Cannot find Skills for Resume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Skills for Resume with id=" + id,
      });
    });
}

// Get all awards for a resume
exports.getAwards = (req, res) => {
  console.log("Finding all awards for resume with id: " + req.params.id);
  const id = req.params.id;
  Resume.findByPk(id, { include: ["awards"] })
    .then((data) => {
      if (data) {
        res.send(data.awards);
      } else {
        res.status(404).send({
          message: `Cannot find Awards for Resume with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error retrieving Awards for Resume with id=" + id,
      });
    });
}

// Delete a Resume with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Resume.destroy({
    where: { resumeId: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Resume was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Resume with id=${id}. Maybe Resume was not found!`,
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
