module.exports = (sequelize, Sequelize) => {
  const Skill = sequelize.define("skill", {
    skillId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    isLanguage: {
      type: Sequelize.BOOLEAN,
    },
    proficiencyLevel: {
      type: Sequelize.STRING,
    },
  });
  return Skill;
};
