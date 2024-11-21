module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        commentId: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        author:{
            type: Sequelize.STRING,
        },
        text: {
            type: Sequelize.STRING,
        }
    });
    return Comment;
};