var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

var models = require('./models.js');
var sequelize = models.sequelize;
var User = models.User;
var Class = models.Class;
var Section = models.Section;
var Schedule = models.Schedule;

var passport = require('passport');
var Strategy = require('passport-local');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwt_secret = 'lol cs498';
var authenticate = expressJwt({secret: jwt_secret});

var router = express.Router();

var app = express();

var port = process.env.PORT || 9999;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  if('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else{
    next();
  }
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

passport.use(new Strategy(
	function(username, password, done) {
		User.findOne({
			where: {
				email: username,
			}
		}).then(function(user) {
			if (!user) {
				return done(null, false, {message: 'User does not exist.'});
			}
			bcrypt.compare(password, user.hash, function(err, res) {
				if(!res) {
					return done(null, false, {message: 'Incorrect password.'});
				} else if(err) {
					return done(null, false, {message: 'Error logging in.'});
				} else {
					return done(null, user);
				}
			});
		});
	}
));

app.use(passport.initialize());

function getError(err) {
  var msg = 'Error: ';

  if(!err.errors) {
    msg += err.message;
  }

  else {
    for(var key in err.errors) {
      msg += err.errors[key].message + ' ';
    }
  }
  return msg;
}


//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Nothing here' });
});


//Class route
var classesRoute = router.route('/class');

classesRoute.get(function(req, res) {
  Class.findAll({
    where: {
      name: req.query.name
    },
    include: [{
      model: Section
    }]
  }).then(function(classes) {
    res.json({message: 'OK', data: classes});
  }).catch(function(err) {
    res.status(500);
    res.json({message: getError(err), data: []});
  });
});

classesRoute.post(function(req, res) {
	Class.create({
		name: req.body.name,
		required: '',
		term: 'fa16',
		description: req.body.description
	}).then(function(obj) {
		res.statusCode = 201;
		return res.json({message: 'created', data: [obj]});
	});
});

//Class:id route
var classRoute = router.route('/class/:id');

classRoute.get(function(req, res) {
  Class.findById(req.params.id).then(function(aClass) {
    if(!aClass) {
      res.status(404);
      res.json({message: 'Class not found', data: [{id: req.params.id}]});
    } else {
      res.json({message: 'OK', data: aClass});
    }
  }).catch(function(err) {
    res.status(500);
    res.json({message: getError(err), data: []});
  });
});


//Section:id route
var sectionRoute = router.route('/sections/:id');

sectionRoute.get(function(req, res) {
  Section.findById(req.params.id).then(function(section) {
    if(!section) {
      res.status(404);
      res.json({message: 'Section not found', data: [{id: req.params.id}]});
    } else {
      res.json({message: 'OK', data: section});
    }
  }).catch(function(err) {
    res.status(500);
    res.json({message: getError(err), data: []});
  });
});

//User route
var usersRoute = router.route('/user');
usersRoute.post(function(req, res) {
	if(!req.body.name || !req.body.email || !req.body.pass) {
		res.statusCode = 500;
		return res.json({message: 'Required field missing', data: []});
	}
	var salt = bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.pass, salt, function(err, hash) {
			User.create({
				name: req.body.name,
				email: req.body.email,
				hash: hash
			}).then(function() {
				res.statusCode = 201;
				return res.json({message: 'User created', data: []});
			}).catch(function(err) {
				res.statusCode = 500;
				return res.json({message: 'Error creating user: ' + err, data: []});
			});
		});
	});
});

var loginRoute = router.route('/login');
loginRoute.post(function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			return res.status(401).json(info);
		}
		req.user = {id: user.id, name: user.name, email: user.email};
		next();
	})(req, res, next);
}, generateToken);

function generateToken(req, res, next) {
	req.token = jwt.sign({
		id: req.user.id,
	}, jwt_secret, {
		expiresIn: 120
	});
	return res.status(200).json({
		message: 'Successfully logged in.',
		user: req.user,
		token: req.token	
	});
}

//Schedule route
var schedulesRoute = router.route('/schedules');

schedulesRoute.get(function(req, res) {
  Schedule.findAll({
    where: {
      name: req.query.name,
      user: req.query.user
    },
    include: [
      { model: Class },
      { model: Section }
    ]
  }).then(function(schedules) {
    res.json({message: 'OK', data: schedules});
  }).catch(function(err) {
    res.status(500);
    res.json({message: getError(err), data: []});
  });
});

schedulesRoute.post(function(req, res) {
        Schedule.create({
                name: req.body.name,
                user: req.body.user
        }).then(function(schedule) {
                res.statusCode = 201;
                return res.json({message: 'Schedule added to database', data: schedule});
        }).catch(function(err) {
		res.status(500);
		res.json({message: getError(err), data: []});
        });
});

//Schedule:id route
var scheduleRoute = router.route('/schedules/:id');

scheduleRoute.get(function(req, res) {
  Schedule.findById(req.params.id).then(function(schedule) {
    if(!schedule) {
      res.status(404);
      res.json({message: 'Schedule not found', data: [{id: req.params.id}]});
    } else {
      res.json({message: 'OK', data: schedule});
    }
  }).catch(function(err) {
    res.status(500);
    res.json({message: getError(err), data: []});
  });
});

scheduleRoute.put(function(req, res) {
  Schedule.findById(req.params.id).then(function(schedule) {
    if(!schedule) {
      res.status(404);
      res.json({message: 'Schedule not found', data: []});
    }
    schedule.update({
      name: req.body.name,
      user: req.body.user
    }).then(function(newSchedule) {
      res.status(200);
      res.json({message: 'Schedule updated', data: newSchedule});
    }).catch(function(err) {
      res.status(500);
      res.json({message: getError(err), data: []});
    });
  });
});

//TODO: Finish delete
scheduleRoute.delete(function(req, res) {
  Schedule.findById(req.params.id).then(function(schedule) {
    if(!schedule) {
      res.status(404);
      res.json({message: 'Schedule not found', data: []});
    }
    schedule.destroy().then(function() {
	//TODO: stuff
    });
  });
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);

