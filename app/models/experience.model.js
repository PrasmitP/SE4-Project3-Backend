module.exports = (sequelize, Sequelize) => {
    const Experience = sequelize.define("experience", {
      experienceId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      companyName: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      accomplishment: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      endDate: {
        type: Sequelize.STRING,
      },
      jobRole: {
        type: Sequelize.STRING,
      },
    });
    return Experience;
  };
  