module.exports = (sequelize, Sequelize) => {
  const Resume = sequelize.define("resume", {
    resumeId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    summary:{
      type: Sequelize.STRING,
    },
    template: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  });
  return Resume;
};
