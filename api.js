const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/dbwatchassign';
const express = require('express');
const app = express();
const port = process.env.PORT || 8002;
const fetch = require('node-fetch');
const fs = require('fs');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
let db;
const dbName = 'dbwatchassign';
let studentTab = [];
let projectTab = [];


MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    db = client.db(dbName)


    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));

    //POST STUDENT

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

    //POST DELETE STUDENT

    app.delete('/list-student', function (req, res) {
        console.log(req.body.name);
        db.collection('studentsTech').deleteOne({ name: req.body.name }, function (err, result) {
            console.log("1 document deleted");
            res.status(200).send("OK");
        })
    })

    //PROJECT

    //GET PROJECT

    app.get('/list-project', async function (req, res) {
        let subject = await db.collection('subject').find().toArray();
        res.json(subject);
    })



    //POST PROJECT

    app.post('/list-project', async function (req, res) {
        let subject = req.body;
        projectTab.push(subject);
        console.log(projectTab);
        db.collection('subject').insertOne(subject, function (err, result) {
            if (err) throw err;
            console.log("1 project inserted");
            res.json({
                msg: "Ok"
            });
        })
    })

})

//LISTEN PORT

app.listen(port, () => {
    console.log('server is running on port: ' + `${port}`);
})