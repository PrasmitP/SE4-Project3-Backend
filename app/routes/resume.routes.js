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

  // Delete a Resume with id
  router.delete("/:id", [authenticate], resumes.delete);

  // Delete all Resumes
  router.delete("/", [authenticate], resumes.deleteAll);

  app.use("/resumes", router);
};
