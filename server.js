const express = require('express');
const app = express();
const fetch = require('node-fetch');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const { response } = require('express');


app.set('view-engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/list-student', async function (req, res) {
    let addStudent;
    await fetch('http://localhost:8002/list-student')
        .then(response => response.json())
        .then(json => addStudent = json)
        .catch(error => console.log('error', error))
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
    const ejs_file = fs.readFileSync(__dirname + '/views/index.ejs', 'utf-8');
    const html = ejs.render(ejs_file, { newStudent: addStudent })
    res.send(html);
})

//insertion des noms des étudiants dans la base de données
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




app.listen(8003, () => {
    console.log('server listening on port 8003')
});