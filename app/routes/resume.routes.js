module.exports = (app) => {
  const resumes = require("../controllers/resume.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new Resume
  router.post("/", [authenticate], resumes.create);

  // Retrieve all Resumes
  router.get("/", [authenticate], resumes.findAll);

  // Retrieve all Resumes for user
  router.get("/userResumes/:userId", [authenticate], resumes.findAllForUser);

  // Retrieve a single Resume with id
  router.get("/:id", [authenticate], resumes.findOne);

  // Update a Resume with id
  router.put("/:id", [authenticate], resumes.update);

  // Get all educations for a resume
  router.get("/:id/educations", [authenticate], resumes.getEducations);

  // Get all experiences for a resume
  router.get("/:id/experiences", [authenticate], resumes.getExperiences);

  // Get all skills for a resume
  router.get("/:id/skills", [authenticate], resumes.getSkills);

  // Delete a Resume with id
  router.delete("/:id", [authenticate], resumes.delete);

  // Delete all Resumes
  router.delete("/", [authenticate], resumes.deleteAll);

  app.use("/resumes", router);
};
