var Database = require('better-sqlite3');
var db = new Database('db.sqlite3');

exports.getStudyName = function (studyId) {
    let stmt = db.prepare("SELECT name from studies where id=?")
    studyName = stmt.get([studyId])['name']
    return studyName
}

exports.checkRegistration = function(studyId, deviceToken, participantId)  {
    let stmt = db.prepare("SELECT id from participants WHERE studyId=? AND deviceToken=?")
    results = stmt.all([studyId, deviceToken])
    if (results.length != 1) {
	      console.error('Failed to find registration')
	      return false
    }

    foundId = results[0]['id']

  if (foundId == participantId) {
  	return true
  } else {
  	console.error('Invalid registration')
  	return false
  }
}
