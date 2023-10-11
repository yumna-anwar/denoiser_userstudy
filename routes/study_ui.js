
var express = require('express');
var router = express.Router();
var Database = require('better-sqlite3');
var db = new Database('db.sqlite3');
var net = require('net');
var fs = require('fs');
//var dbhelp = require('./dbhelp')
var path = require("path");


function walk(dir, callback) {
	fs.readdir(dir, function(err, files) {
		if (err) throw err;
		files.forEach(function(file) {
			var filepath = path.join(dir, file);
			fs.stat(filepath, function(err,stats) {
				if (stats.isDirectory()) {
					walk(filepath, callback);
				} else if (stats.isFile()) {
					callback(filepath, stats);
				}
			});
		});
	});
}

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483646;
};

Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

function shuffleArray(array) {
		var milliseconds = (new Date).getTime();
		var random = new Random(milliseconds);
		console.log('Seed is : ', milliseconds);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(random.nextFloat() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
		return milliseconds;
}
/* fact of a no */

function sFact(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('*** index ****')
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
  let options = db.prepare('SELECT name,id from useroptions;').all()
  console.log(options)
  res.render('index', {'options' : options});
});

/* study page get */
router.post('/study', function(req, res) {
  console.log('*** /ui/study/ ****')
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
  //let options = db.prepare('SELECT name,id from mainoptions;').all()
	let subjectid = user;
	let startStudy = req.body['startStudy'];
	var trialNo = parseInt(req.body['trialNo']);
	var endSet = parseInt(req.body['endSet']);
	var noConfigs = 15;
	var noCombs = sFact(noConfigs) / (sFact(noConfigs - 2) * 2); // nC2 = 15 ! / 13! 2!
	console.log('noCombs are : ', noCombs);
	var randomSeed;
  // console.log(options)
	if(startStudy == 1){
		console.log('Study started from beginning.');
		let lastNo = db.prepare('SELECT trialNo from actions WHERE subjectId=? ORDER BY id DESC LIMIT 1;')
		lastTrialNo=lastNo.get(subjectid)
		if(lastTrialNo){
			trialNo = lastTrialNo.trialNo
		}
		let statement = db.prepare("INSERT INTO actions (subjectId,trialNo,actionType,actionTime) VALUES(?,?,?,datetime('now', 'localtime'));")
	  info=statement.run([subjectid, trialNo, "startStudy"]);
	  console.log(info);
		qData = db.prepare('SELECT randomSeed FROM users WHERE user=?').get(user)
		randomSeed = qData['randomSeed'];
		console.log('Random seed : ', randomSeed);
		if(randomSeed < 0)
		{
			// random shuffled order for configs
			var configComb = new Array(0);
			var extraPairs = [[6, 10], [1, 2], [4, 11], [1, 9]];
			var count = 0;
			for(var iTemp=1;iTemp<noConfigs;iTemp++)
			{
				for(var iTemp2=iTemp+1;iTemp2<noConfigs+1;iTemp2++)
				{
					configComb.push([iTemp, iTemp2]);
					configComb.push([iTemp, iTemp2]);
					configComb.push([iTemp2, iTemp]);
					configComb.push([iTemp2, iTemp]);
					console.log(configComb[count]);
					count++;
				}
			}
			// extra noCombs
			for(var iTemp=0; iTemp<extraPairs.length; iTemp++)
			{
				configComb.push([extraPairs[iTemp][0], extraPairs[iTemp][1]]);
				console.log(configComb[count]);
				count++;
			}
			randomSeed = shuffleArray(configComb);
			for(var iTemp=0;iTemp<noCombs*4+16;iTemp++){
				console.log(configComb[iTemp]);
			}
			let updateSeed = db.prepare('UPDATE users SET randomSeed=? WHERE user=?')
			info = updateSeed.run([randomSeed, user])
			console.log(info);
		}
	} else {
		console.log('Recurring study.');
		//let statement = db.prepare('INSERT INTO actions (subjectId,trialNo,actionType,actionTime) VALUES(?,?,?,?);')
		let actions = req.body['actions'].split(',');
		let choices = req.body['choices'].split(',');
		let statement = db.prepare('INSERT INTO actions (subjectId,trialNo,actionType,actionTime) VALUES(?,?,?,?);')
		let choiceStatement = db.prepare('INSERT INTO choices (subjectId, trialNo, aPresetNo, bPresetNo, sentenceNo, abChoice, reasonChoice) VALUES (?,?,?,?,?,?,?)')
		qData = db.prepare('SELECT randomSeed FROM users WHERE user=?').get(user);
		randomSeed = qData['randomSeed'];
		console.log('Random seed : ',randomSeed);
		console.log('Choices are : ', choices);
		//console.log(actions);
		//console.log(choices);
		for(var iTemp=0;iTemp<actions.length; iTemp+=3){
			info=statement.run([subjectid, actions[iTemp], actions[iTemp+1], actions[iTemp+2]]);
		  console.log(info);
		}
		var abChoice = '';
		if(choices[0] === '0'){
			abChoice = 'A';
		} else {
			abChoice = 'B';
		}
		var preferences = '';
		var firstFlag = 0;
		if(choices[1] === '1'){
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'TooLoud'
		}
		if(choices[2] === '1')
		{
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'TooSoft'
		}
		if(choices[3] === '1'){
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'NotClearMuffled'
		}
		if(choices[4] === '1')
		{
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'NotNatural'
		}
		if(choices[5] === '1'){
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'TooTinnySharpHarsh'
		}
		if(choices[6] === '1'){
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'TooHollowBoomy'
		}
		if(choices[7] === '1')
		{
			if(firstFlag != 0)
			{
				preferences += ',';
			} else {
				firstFlag = 1;
			}
			preferences += 'NoneOfTheAbove'
		}
		var presetA = parseInt(choices[8]);
		var presetB = parseInt(choices[9]);
		var sentenceNo = parseInt(choices[10]);
		console.log('Choice A is : ', presetA);
		console.log('Choice B is : ', presetB);
		info=choiceStatement.run([subjectid, trialNo, presetA, presetB, sentenceNo, abChoice, preferences])
		console.log(info)
	}
	if(trialNo < 4 * noCombs + 16){
		if(endSet == 0 || isNaN(endSet))
		{
			res.render('study', {'subjectId': subjectid, 'trialNo': trialNo, 'randomSeed': randomSeed});
		} else {
			res.render('setbreak', {'trialNo': trialNo});
		}
	} else {
		res.render('endstudy', {});
	}

});

/* logout */

router.post('/logout', function(req, res) {
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
  delete req.session.user
	delete req.session.authenticated
  res.redirect('/');
});

/* break post */
router.post('/break', function(req, res) {
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
	var trialNo = parseInt(req.body['trialNo']);
  res.render('break', {'trialNo': trialNo});
});

/* tut break post */
router.post('/demo/break', function(req, res) {
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
	var trialNo = parseInt(req.body['trialNo']);
  res.render('tutbreak', {'trialNo': trialNo});
});

/* Demo post */
router.post('/demo', function(req, res) {
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
  res.render('tuts', {});
});

/* Demo post */
router.post('/demo/tutorial', function(req, res) {
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
  res.render('demo', {trialNo: 0});
});

/* practice post */
router.post('/demo/practice', function(req, res) {
	//res.io.emit("socketToMe", "users");
	//res.send('respond with a resource.');
	let user = req.session.user
	let authenticated = req.session.authenticated
	console.log('user: ', user)
	console.log('Authenticated: ', authenticated)
	var trialNo = parseInt(req.body['trialNo']);
	console.log('Practice trial no is : ', trialNo);
	if(isNaN(trialNo))
	{
		trialNo = 0;
	}
	if(trialNo < 5){
			res.render('practice', {trialNo: trialNo});
	} else {
		res.render('endpractice', {})
	}
});


module.exports = router;
