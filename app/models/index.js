const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.session = require("./session.model.js")(sequelize, Sequelize);
db.resume = require("./resume.model.js")(sequelize, Sequelize);
db.skill = require("./skill.model.js")(sequelize, Sequelize);
db.experience = require("./experience.model.js")(sequelize, Sequelize);
db.education = require("./education.model.js")(sequelize, Sequelize);
db.project = require("./project.model.js")(sequelize, Sequelize);
db.comment = require("./comment.model.js")(sequelize, Sequelize);

// foreign key for session
db.user.hasMany(
  db.session,
  { as: "session" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);
db.session.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for resumes
db.user.hasMany(
  db.resume,
  { as: "resume" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.resume.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for skills
db.user.hasMany(
  db.skill,
  { as: "skill" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.skill.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for experiences
db.user.hasMany(
  db.experience,
  { as: "experience" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.experience.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for educations
db.user.hasMany(
  db.education,
  { as: "education" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.education.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for projects
db.user.hasMany(
  db.project,
  { as: "project" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.project.belongsTo(
  db.user,
  { as: "user" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// foreign key for comment
db.resume.hasMany(
  db.comment,
  { as: "comment" },
  { foreignKey: { allowNull: true }, onDelete: "CASCADE" }
);
db.comment.belongsTo(
  db.resume,
  { as: "resume" },
  { foreignKey: { allowNull: false }, onDelete: "CASCADE" }
);

// Each Resume has multiple Educations
// Each Education can be in multiple Resumes
// Many to Many relationship
db.education.belongsToMany(db.resume, { through: "ResumeEducation" });
db.resume.belongsToMany(db.education, { through: "ResumeEducation" });


// Same thing for the other models:

db.experience.belongsToMany(db.resume, { through: "ResumeExperience" });
db.resume.belongsToMany(db.experience, { through: "ResumeExperience" });

db.skill.belongsToMany(db.resume, { through: "ResumeSkill" });
db.resume.belongsToMany(db.skill, { through: "ResumeSkill" });

db.project.belongsToMany(db.resume, { through: "ResumeProject" });
db.resume.belongsToMany(db.project, { through: "ResumeProject" });
module.exports = db;
