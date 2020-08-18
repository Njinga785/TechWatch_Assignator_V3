const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/dbwatchassign';
const express = require('express');
const app = express();
const port = process.env.PORT || 8002;
const fetch = require('node-fetch');
const fs = require('fs');
const bodyParser = require('body-parser');
let db;
const dbName = 'dbwatchassign';
let studentTab = [];


MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    db = client.db(dbName)


    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/list-student', async function (req, res) {
        let test = await db.collection('studentsTech').find().toArray();
        res.json(test);
    })

    app.post('/list-student', async function (req, res) {
        let student = req.body;
        studentTab.push(student);
        console.log(studentTab);
        db.collection('studentsTech').insertOne(student, function (err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            res.json({
                msg: "ok"
            })
        })
    })

    app.delete('/list-student', function (req, res) {
        res.status(200).send('toto');
    })

})

app.listen(port, () => {
    console.log('server is running on port: ' + `${port}`);
})