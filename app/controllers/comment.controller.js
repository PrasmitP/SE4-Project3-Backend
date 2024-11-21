const { text } = require("express");
const db = require("../models");
const Comment = db.comment;
const Op = db.Sequelize.Op;
// Create and Save a new Comment
exports.create = (req, res) => {
    // Validate request
    if (!req.body.text || !req.params.resumeId) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }
    let resumeId = req.params.resumeId;
    // Create an Comment JS Object
    const comment = {
        author: req.body.author,
        text: req.body.text,
        resumeResumeId: resumeId
    };

    console.log("Creating comment: " + comment.text);
    // Trying to save Comment in the database
    Comment.create(comment).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Comment.",
        });
    });
};

// Find an Comment for user with an id
exports.findAllForResume = (req, res) => {
    console.log("Finding all comments for resume with id: " + req.params.resumeId);
    const resumeId = req.params.resumeId;
    Comment.findAll({ where: { resumeResumeId: resumeId } })
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find  for user with id=${resumeId}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    "Error retrieving Comments for resume with id=" + resumeId,
            });
        });
};

// Delete an Comment with the specified id in the request
exports.delete = (req, res) => {
    const commentId = req.params.commentId;
    Comment.destroy({
        where: { commentId: commentId },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Comment was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Comment with id=${commentId}. Maybe Comment was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Could not delete Comment with id=" + commentId,
            });
        });
};
