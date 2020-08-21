const express = require('express');
const app = express();
const port = process.env.PORT || 8003;
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { response, json } = require('express');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Pour la lecteur des fichiers css
app.use(express.static(__dirname + '/public'));


//*************************************** PAGE INDEX.JS *********************************************//

//GET LIST-STUDENTS
app.get('/list-student', async function (req, res) {
    let addStudent;
    fetch('http://localhost:8002/list-student')
        .then(response => response.json())
        .then(json => {
            addStudent = json
            //console.log(json)
            res.render('./pages/index.ejs', { newStudent: addStudent, newProject: [] });
        })
        .catch(error => console.log('error', error))
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
})

//POST LIST-STUDENTS
app.post('/list-student', async function (req, res) {
    fetch('http://localhost:8002/list-student', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: req.body.name, statut: true })
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
    //console.log(req.body.name)
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

//*************************************** PAGE ASSIGNATION-PROJECT.JS *********************************************//


//POST ASSIGNATION-PROJECT

app.post('/assignation-project', async function (req, res) {
    let studentsList = await fetch('http://localhost:8002/list-student');
    let studentsListJs = await studentsList.json();
    console.log(studentsListJs);
    let aleaListStudents = studentsListJs.sort(() => Math.random() - 0.5);
    let aleaListStudentsName = aleaListStudents.slice(0, req.body.nbr);
    aleaListStudentsName.forEach(element => {
       fetch(`http://localhost:8002/change-status/${element.name}`)
    });
    //console.log(aleaListStudentsNbr.length); // nom aléatoire d'étudiants en fonction du nombre (nbr)
    //console.log(aleaListStudentsNbr);
    //console.log(req.body.subject); // Sujet saisi
    let listStudentsAvailable = aleaListStudentsName.filter(x => studentsListJs.includes(x));
    //console.log(aleaListStudentsNbr);
    console.log(listStudentsAvailable);
    await fetch('http://localhost:8002/list-project', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject: req.body.subject, students: aleaListStudentsName, date: req.body.date, taken: true })
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



//GET ASSIGNATION-PROJECT

app.get('/assignation-project', async function (req, res) {
    let addProject;
    fetch('http://localhost:8002/list-project')
        .then((response) => response.json())
        .then((json) => {
            addProject = json
            res.render('./pages/assignation.ejs', { newProject: addProject, newStudent: [] });

        })
        .catch((error) => {
            console.log('error', error)
        })
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
})


//*************************************** PAGE D'ACCUEIL.EJS *********************************************//

//APP.GET LIST-PROJECT & LIST STUDENTS

app.get('/accueil', async function (req, res) {
    let addStudent;
    let addProject;
    let studentsList = await fetch('http://localhost:8002/list-student');
    let studentsListJs = await studentsList.json();
    let listStudentsAvailable = studentsListJs.filter(available => available.statut == true);
    console.log(listStudentsAvailable);
    //console.log(studentsListJs);
    let aleaListStudents = studentsListJs.sort(() => Math.random() - 0.5);
    let aleaListStudentsName = aleaListStudents.slice(0, req.body.nbr);
    addStudent = studentsListJs;
    //console.log(aleaListStudentsNbr.length); // nom aléatoire d'étudiants en fonction du nombre (nbr)
    //console.log(aleaListStudentsNbr);
    //console.log(req.body.subject); // Sujet saisit
    //console.log(listStudentsAvailable);

    await fetch('http://localhost:8002/list-project') //Project lists
        .then((response) => response.json())
        .then(json => addProject = json.slice(-2))
        .catch(error => console.log('error', error))
    console.log(addProject[0].taken)


    // await fetch('http://localhost:8002/list-student') //List-Students
    //     .then(response => response.json())
    //     .then(json => addStudent = json)
    //     .catch(error => console.log('error', error))
    // console.log(addStudent[0].statut)
    // for (let i = 0; i < addStudent.length; i++) {
    //     if (addProject[i].taken !== addStudent[i].statut) {
    //         listStudentsAvailable.push(student.name)
    //     }
    // }




    res.setHeader('Content-type', 'text/html;charset=UTF-8');
    res.render('./pages/accueil.ejs', { newProject: addProject, newStudent: addStudent, availableStudent : listStudentsAvailable });

})






//PORT
app.listen(8003, () => {
    console.log('server listening on port: ' + `${port}`)
});
