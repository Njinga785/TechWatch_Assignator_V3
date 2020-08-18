const express = require('express');
const app = express();
const fetch = require('node-fetch');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');


app.set('view-engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/list-student', function (req, res) {
    res.setHeader('Content-type', 'text/html;charset=UTF-8');
    res.render('index.ejs');
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

//Récupération de la liste des étudiants 

app.get('/list-student', async function (req, res) {
    await fetch('http://localhost:8002/list-student')
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.log('error', error))
})

app.listen(8003, () => {
    console.log('server listening on port 8003')
});