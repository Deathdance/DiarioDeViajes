var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
// connection
var mongoose = require('mongoose');
var user = process.env.USER;
var password = process.env.PASSWORD;
mongoose.connect('mongodb://'+user+':'+password+'@ds063909.mongolab.com:63909/diario_viajes');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('connection OK!');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// schema
var userSchema = mongoose.Schema({
    name: String,
    password: String
});

var Users = mongoose.model('Users', userSchema);


// Recoger usuario local
passport.use(new LocalStrategy(
  function(username, password, done) {

    // Coge el documento de MongoDB
    console.log(username);
    console.log(password);


    Users.find({ name: username }, function (err, users) {
      if (err) return console.error(err);
      console.log('Find user:');
      console.log(users);

      // Desglose del usuario encontrado
      console.log(users[0].password);
      console.log(users[0].name);

      var hash = users[0].password;
      //console.log(hash);
      //console.log(bcrypt.hashSync(hash));

      // compara usuario local(username y password) con el de la base de datos(users.name y .password) 
      //if ((username == users.name) && (bcrypt.compareSync(password, hash))) {
      if ((username == users[0].name) && (password==hash)) {
        // login OK
        return done(null, username);
      } else {
        // login KO
        console.log("resultados:");
        console.log("usuario local: "+username);
        console.log("usuario db: "+users[0].name);
        console.log("contraseña local: "+password);
        console.log("contraseña bd: "+users[0].password);
        return done(null, false);
      }

    });
  }
));


app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ secret: 'topsecret',
                  saveUninitialized: true,
                  resave: true }));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// public files
app.use(express.static(__dirname + '/public'));


app.post('/login',
  passport.authenticate('local', { successRedirect: '/loginSuccess',
                                   failureRedirect: '/loginFailure',
                                   failureFlash: false })
);

app.get('/', function(req,res) {
  res.redirect('index.html');
});

app.get('/loginFailure', function(req,res) {
  res.send('Login KO. username/password incorrect');
});


app.get('/loginSuccess', ensureAuthenticated, function(req,res) {
  res.send('Login OK. Hello ' + req.user);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/otherpage', ensureAuthenticated, function(req, res){
  res.send('other page');
});


var server = app.listen(process.env.PORT || 3000, function(){
    console.log('Listening in port %d', server.address().port);
});