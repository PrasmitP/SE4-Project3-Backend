module.exports = (app) => {
    const skills = require("../controllers/skill.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new Skill
    router.post("/", [authenticate], skills.create);

    // Retrieve all Skill
    router.get("/", [authenticate], skills.findAll);

    // Retrieve all Skill for user
    router.get("/userSkills/:userId", [authenticate], skills.findAllForUser);

    // Retrieve a single Skill with id
    router.get("/:id", [authenticate], skills.findOne);

    // Update an Skill with id
    router.put("/:id", [authenticate], skills.update);

    // Delete an Skill with id
    router.delete("/:id", [authenticate], skills.delete);

    // Delete all Skills
    router.delete("/", [authenticate], skills.deleteAll);

    app.use("/skills", router);
};
