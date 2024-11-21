module.exports = (app) => {
    const comments = require("../controllers/comment.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();

    // Create a new Comment
    router.post("/:resumeId", [authenticate], comments.create);

    // Retrieve all Comments for resume
    router.get("/:resumeId", [authenticate], comments.findAllForResume);

    // Delete an Comment with id
    router.delete("/single/:commentId", [authenticate], comments.delete);

    app.use("/resumeComments", router);
};
