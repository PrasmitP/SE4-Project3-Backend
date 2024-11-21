module.exports = (sequelize, Sequelize) => {
    const Award = sequelize.define("award", {
      awardId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      endDate: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
    return Award;
  };
  