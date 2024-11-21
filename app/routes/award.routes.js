module.exports = (app) => {
    const awards = require("../controllers/award.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new Award
    router.post("/", [authenticate], awards.create);
    
    // Retrieve all Award for user
    router.get("/userAwards/:userId", [authenticate], awards.findAllForUser);

    // Retrieve a single Award with id
    router.get("/:awardId", [authenticate], awards.findOne);

    // Update an Award with id
    router.put("/:awardId", [authenticate], awards.update);

    // Update relation for Award
    router.put("/updateRelation/:awardId", [authenticate], awards.updateRelation);

    // Delete an Award with id
    router.delete("/:awardId", [authenticate], awards.delete);

    app.use("/awards", router);
};
