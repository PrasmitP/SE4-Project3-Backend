module.exports = (sequelize, Sequelize) => {
    const Education = sequelize.define("education", {
      educationId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      institutionName: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      endDate: {
        type: Sequelize.STRING,
      },
      bachalorName: {
        type: Sequelize.STRING,
      },
      gpa: {
        type: Sequelize.STRING,
      },
    });
    return Education;
  };
  