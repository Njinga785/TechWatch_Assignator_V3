const express = require('express');
const app = express();
const port = process.env.PORT || 8003;
const fetch = require('node-fetch');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const { response } = require('express');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Pour la lecteur des fichiers css
app.use(express.static(__dirname + '/public'));

//STUDENTS//

//GET STUDENTS/pages
app.get('/list-student', async function (req, res) {
    let addStudent;
    await fetch('http://localhost:8002/list-student')
        .then(response => response.json())
        .then(json => addStudent = json)
        .catch(error => console.log('error', error))
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
    //const ejs_file = fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8');
    //const html = ejs.render(ejs_file, { newStudent: addStudent, newProject: [] })
    res.render('./pages/index.ejs', { newStudent: addStudent, newProject: [] });
    //res.send(html);
})

//POST STUDENTS
app.post('/list-student', async function (req, res) {
    fetch('http://localhost:8002/list-student', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: req.body.name })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (success) {
            console.log('Request success: ', success);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });
    res.redirect('/list-student');
});

//DELETE STUDENT
app.post("/list-student/delete", async function (req, res) {
    console.log(req.body.name)
    await fetch('http://localhost:8002/list-student', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: req.body.name })
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (success) {
            console.log('Request success: ', success);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });
    res.redirect('/list-student');
});

//ASSIGNATION PROJECT

//ADD PROJECT

app.post('/assignation-project', async function (req, res) {
    let studentsList = await fetch('http://localhost:8002/list-student');
    let studentsListJs = await studentsList.json();
    //console.log(studentsListJs);
    let aleaListStudents = studentsListJs.sort(() => Math.random() - 0.5);
    let aleaListStudentsNbr = aleaListStudents.slice(0, req.body.nbr); 
    console.log(aleaListStudentsNbr.length); // nom aléatoire d'étudiants en fonction du nombre (nbr)
    //console.log(JSON.stringify(aleaListStudentsNbr));
    console.log(req.body.subject); // Sujet saisi
    await fetch('http://localhost:8002/list-project', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject: req.body.subject, students: aleaListStudentsNbr, date:req.body.date })
    })
        
        .then(function (response) {
            return response.json();
        })
        .then(function (success) {
            console.log('Request success: ', success);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });
    res.redirect('/assignation-project');
});


//Récupération de la liste des étudiants
//GET PROJECT

app.get('/assignation-project', async function (req, res) {
    let studentsList = await fetch('http://localhost:8002/list-student');
    let studentsListJs = await studentsList.json();
    //console.log(studentsListJs);
    let addProject;
    fetch('http://localhost:8002/list-project')
        .then((response) => response.json())
        .then((json) => {
            addProject = json
            res.render('./pages/assignation.ejs', { newProject: addProject, newStudent: []});

        })
        .catch((error) => {
            console.log('error', error)
        })
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
    const ejs_file = fs.readFileSync(__dirname + '/views/pages/assignation.ejs', 'utf-8');
    // console.log(addProject);
    // const html = ejs.render(ejs_file, { newProject: addProject, newStudent: []})
    // res.send(html);
    
})









//PORT
app.listen(8003, () => {
    console.log('server listening on port: ' + `${port}`)
});
