"""
Creates the default templates
"""
import sqlite3
import os

if __name__ == "__main__":
    try:
        os.remove('db.sqlite3')
    except FileNotFoundError:
        pass

    conn = sqlite3.connect('db.sqlite3')
    c = conn.cursor()

    # populate mainoptions
    c.execute('''
    CREATE TABLE IF NOT EXISTS useroptions(id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT)''');
    c.execute('INSERT INTO useroptions(name) VALUES("Study Demo")')
    c.execute('INSERT INTO useroptions(name) VALUES("Start Study")')
    conn.commit()

    # populate REARs
    c.execute('CREATE TABLE IF NOT EXISTS meanrears(id INTEGER PRIMARY KEY AUTOINCREMENT, Freq250 INTEGER, Freq500 INTEGER, Freq1000 INTEGER, Freq2000 INTEGER, Freq3000 INTEGER, Freq4000 INTEGER, Freq6000 INTEGER, Freq8000 INTEGER)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,60,59,67,67,67,58,56)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,59,58,65,65,64,56,53)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,61,63,74,78,77,70,66)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(58,68,67,78,78,79,71,68)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,58,62,79,83,81,73,68)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,60,58,65,62,59,51,46)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,59,57,69,73,73,64,62)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,62,61,70,71,71,63,60)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,59,55,74,80,79,69,66)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,59,59,72,76,77,66,64)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(59,61,64,77,80,81,71,67)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(56,60,59,69,70,71,62,59)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,59,61,72,75,75,67,63)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(57,70,68,75,73,70,66,63)');
    c.execute('INSERT INTO meanrears(Freq250, Freq500, Freq1000, Freq2000, Freq3000, Freq4000, Freq6000, Freq8000) VALUES(62,66,68,81,84,83,75,73)');
    conn.commit()

    # create action table
    c.execute('''
    CREATE TABLE IF NOT EXISTS actions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subjectId INTEGER,
        trialNo INTEGER,
        actionType TEXT(48),
        actionTime DATETIME)''');
    conn.commit()

    # create choices table
    c.execute('''
    CREATE TABLE IF NOT EXISTS choices(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subjectId TEXT(50),
        trialNo INTEGER,
        aPresetNo INTEGER,
        bPresetNo INTEGER,
        sentenceNo INTERGER,
        abChoice TEXT(5),
        reasonChoice TEXT(100))''');
    conn.commit()

    # c.execute('''CREATE TABLE IF NOT EXISTS participants(id INTEGER PRIMARY KEY AUTOINCREMENT,
    #                         studyId INTEGER,
    #                         deviceToken TEXT,
    #                         localMinInterval INTEGER, localRandomInterval INTEGER,
    #                         remoteMinInterval INTEGER, remoteRandomInterval INTEGER,
    #                         remoteModeTimeout INTEGER,
    #                         startTime DATETIME, endTime DATETIME,
    #                         startDate DATETIME, endDate DATETIME,
    #                         audioRecording INTEGER,
    #                         locationRecording INTEGER,
    #                         recordingDuration INTEGER,
    #                         userInitiated INTEGER,
    #                         UNIQUE(deviceToken),
    #                         FOREIGN KEY (studyId) REFERENCES studies(id))''')
    # conn.commit()

    # c.execute('''
    # CREATE TABLE IF NOT EXISTS actions(
    #     id INTEGER,
    #     parentId INTEGER NOT NULL,
    #     type INTEGER NOT NULL,
    #     origin INTEGER NOT NULL,
    #     state INTEGER NOT NULL,
    #     scheduleTime DATETIME,
    #     deliveryTime DATETIME,
    #     error INTEGER,
    #     errorMessage TEXT(2048),
    #     outputFile TEXT,
    #     participantId INTEGER,
    #     studyId INTEGER,
    #     FOREIGN KEY (participantId) REFERENCES participants(id),
    #     FOREIGN KEY (studyId) REFERENCES studies(id),
	# PRIMARY KEY(id, participantId, studyId))''')
    # conn.commit()

    # populate users
    c.execute('''CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        password TEXT,
        admin INTEGER,
        randomSeed INTERGER,
        UNIQUE(user)
    )''')
    c.execute("INSERT INTO users(user, password, admin, randomSeed) VALUES('yumna', 'denoiser@study', 1, -1)")
    c.execute("INSERT INTO users(user, password, admin, randomSeed) VALUES('user', 'user@2018', 0, -1)")
    conn.commit()

    conn.close()
