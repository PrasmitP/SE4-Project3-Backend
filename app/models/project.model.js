module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("project", {
    projectId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    projectName: {
      type: Sequelize.STRING,
    },
    startDate: {
      type: Sequelize.STRING,
    },
    endDate: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });
  return Project;
};
