var express = require('express');
var router = express.Router();
var Database = require('better-sqlite3');
var db = new Database('db.sqlite3');
var fs = require('fs');
var dbhelp = require('./dbhelp')
var path = require("path");


router.get('/login', function(req, res) {
	res.render('login', {})
})

router.post('/login/credentials', function(req, res) {
	console.log('*** login credentials ***')
	let user = req.body['user']
	let password = req.body['password']
	console.log('login crentials', user, password)

	row = db.prepare('SELECT password, admin FROM users WHERE user=?').get(user)
  if (row) {
		console.log('User found')
    expectedPassword = row.password
		admin = row.admin
		console.log('Expected password', expectedPassword)
    if (user === user && (password === expectedPassword)) {
      //success this is authetificated
      console.log('req.sesssion', req.session)
      req.session.authenticated = true
      req.session.user = user
			if(admin == 0){
      	res.redirect('/study_ui')
			} else {
				console.log('Admin authorization.');
				res.redirect('/study_ui')
			}
    }
  }

  // we reach this point if we do not get a correct login
	console.log('authentification failed')
	res.redirect('/login?retry');
})

router.get('/', function(req, res, next) {
  console.log('*** index user / admin ****')
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
	row = db.prepare('SELECT admin FROM users WHERE user=?').get(user)
	if(row)
	{
		if(row.admin == 0){
			console.log('If user not admin: redirect to ui')
  		res.redirect('/study_ui')
		} else {
			console.log('If user is admin: redirect to admin tools')
			res.redirect('/admin')
		}
	} else {
		res.redirect('/login')
	}
});

module.exports = router;
