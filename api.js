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


//************************************************************** MONGO CLIENT ************************************************//

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err;
    db = client.db(dbName);
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));


    //************************************************************** GET ALL STUDENTS ************************************************//

    app.get('/list-student', async function (req, res) {
        let studenList = await db.collection('studentsTech').find({ statut: true}).toArray();
        console.log(studenList);
        res.json(studenList);
    })

    //************************************************************** POST ONE STUDENT ************************************************//
    app.post('/list-student', async function (req, res) {
        let studentAvailable = req.body;
        studentTab.push(studentAvailable);
        //console.log(studentTab);
        db.collection('studentsTech').insertOne(studentAvailable, function (err, result) {
            if (err) throw err;
            console.log("1 document inserted");
            res.json({
                msg: "ok"
            })
        })
    })

    //************************************************************** GET LIST STUDENTS ONLY TRUE ************************************************//
    // app.get('/list-student-true', async function(req, res){
    //     let studentsTrue = await db.collection('studentsTech').find({ statut: true}).toArray();
    //     if(error) throw error;
    //     console.log(studentsTrue); 
    //     res.json(studentsTrue);
    // });
      
    
    //************************************************************** POST DELETE STUDENT ************************************************//
    app.delete('/list-student', function (req, res) {
        //console.log(req.body.name);
        db.collection('studentsTech').deleteOne({ name: req.body.name }, function (err, result) {
            console.log("1 document deleted");
            res.status(200).send("OK");
        })
    })

    //************************************************************** GET PROJECT ********************************************************//

    //GET PROJECT

    app.get('/list-project', async function (req, res) {
        let subject = await db.collection('subject').find().toArray();
        //console.log(subject);
        res.json(subject);
    })

    //************************************************************** POST PROJECT ************************************************//

    app.post('/list-project', async function (req, res) {
        let subject = req.body;
        projectTab.push(subject);
        //console.log(projectTab);
        db.collection('subject').insertOne(subject, function (err, result) {
            if (err) throw err;
            console.log("1 project inserted");
            res.json({
                msg: "Ok"
            });
        })
    })
})

//************************************************************** CHANGE STATUS ************************************************//

app.get('/change-status/:name', async function (req, res) {
    db.collection('studentsTech').updateOne({ name: req.params.name }, { $set: { "statut": false } }, function (err, result) {
        if (err) throw err;
        console.log("1 status changed");
        res.send("KO");
    });
});
//pour reset la liste = updateMany({},{$set: {"statut":false}}, function(err, result)..




//************************************************************** LISTEN PORT ************************************************//

app.listen(port, () => {
    console.log('server is running on port: ' + `${port}`);
})