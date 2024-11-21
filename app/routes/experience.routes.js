module.exports = (app) => {
    const experiences = require("../controllers/experience.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new Experience
    router.post("/", [authenticate], experiences.create);

    // Retrieve all Experience
    router.get("/", [authenticate], experiences.findAll);

    // Retrieve all Experience for user
    router.get("/userExperiences/:userId", [authenticate], experiences.findAllForUser);

    // Retrieve a single Experience with id
    router.get("/:id", [authenticate], experiences.findOne);

    // Update an Experience with id
    router.put("/:id", [authenticate], experiences.update);

    // Update relation for Experience
    router.put("/updateRelation/:id", [authenticate], experiences.updateRelation);

    // Delete an Experience with id
    router.delete("/:id", [authenticate], experiences.delete);

    // Delete all Experiences
    router.delete("/", [authenticate], experiences.deleteAll);

    app.use("/experiences", router);
};
