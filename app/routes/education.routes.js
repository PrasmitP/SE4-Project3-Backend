module.exports = (app) => {
    const educations = require("../controllers/education.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new Education
    router.post("/", [authenticate], educations.create);

    // Retrieve all Education
    router.get("/", [authenticate], educations.findAll);

    // Retrieve all Education for user
    router.get("/userEducations/:userId", [authenticate], educations.findAllForUser);

    // Retrieve a single Education with id
    router.get("/:id", [authenticate], educations.findOne);

    // Update an Education with id
    router.put("/:id", [authenticate], educations.update);

    // Update relation for Education
    router.put("/updateRelation/:id", [authenticate], educations.updateRelation);

    // Delete an Education with id
    router.delete("/:id", [authenticate], educations.delete);

    // Delete all Educations
    router.delete("/", [authenticate], educations.deleteAll);

    app.use("/educations", router);
};
