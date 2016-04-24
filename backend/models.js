var Sequelize = require('sequelize');
var Promise = require('bluebird');
var sequelize = new Sequelize('postgres://cs498:cs498rk1@127.0.0.1:5432/scheduler');

var User = sequelize.define('user', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		field: 'email',
		unique: true,
		allowNull: false,
		validate: {
			isEmail: true,
			notEmpty: true
		}
	},
	hash: {
		type: Sequelize.STRING,
		field: 'hash',
		allowNull: false
	}
}, {
	freezeTableName: true
});

var Class = sequelize.define('class', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		allowNull: false
	},
	required: {
		type: Sequelize.STRING,
		field: 'required'
	},
	term: {
		type: Sequelize.STRING,
		field: 'term',
		allowNull: false
	},
	description: {
		type: Sequelize.STRING,
		field: 'description'
	}
}, {
	freezeTableName: true
});

var Section = sequelize.define('section', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		allowNull: false
	},
	crn: {
		type: Sequelize.INTEGER,
		field: 'crn',
	},
	section_code: {
		type: Sequelize.STRING,
		field: 'section_code',
		allowNull: false
	},
	class_times: {
		type: Sequelize.ARRAY(Sequelize.RANGE(Sequelize.DATE)),
		field: 'class_times',
	},
	section_type: {
		type: Sequelize.STRING,
		field: 'section_type'
	},
	credit_hours: {
		type: Sequelize.INTEGER,
		field: 'credit_hours'
	},
	description: {
		type: Sequelize.STRING,
		field: 'description'
	}
}, {
	freezeTableName: true
});

var Schedule = sequelize.define('schedule', {
	name: {
		type: Sequelize.STRING,
		field: 'name',
		allowNull: false
	},
/*
	classes: {
		type: Sequelize.ARRAY(Sequelize.INTEGER),
		field: 'classes'
	},
	sections: {
		type: Sequelize.ARRAY(Sequelize.INTEGER),
		field: 'sections'
	}
*/
});

User.hasMany(Schedule, {as: 'Schedules'});

Class.hasMany(Section, {as: 'Sections'});

Section.belongsToMany(Schedule, {through: 'SectionsInSchedules'});
Class.belongsToMany(Schedule, {through: 'ClassesInSchedules'});

/*
Promise.join(User.sync({force: true}), function() {console.log('User table created')});
Promise.join(Schedule.sync({force: true}), function() {console.log('Schedule table created')});
Promise.join(Class.sync({force: true}), function() {console.log('Class table created')});
Promise.join(Section.sync({force: true}), function() {console.log('Section table created')});
*/
sequelize.sync().then(function() {console.log('Tables created')});

module.exports.sequelize = sequelize;
module.exports.User = User;
module.exports.Schedule = Schedule;
module.exports.Class = Class;
module.exports.Section = Section;
