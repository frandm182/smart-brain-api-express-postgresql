const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-node');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db =knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'travis',
        database: 'smart-brain'
    }
});

const app = express();
app.use(bodyParser.json())

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'fran',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Fran',
            email: 'luis@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: {
        id: '987',
        has: '',
        email: 'fran@gmail.com'
    }
}

app.use(cors())

app.get('/', (req,res) => {
    res.send('it is working');
})

app.post('/signin', signin.handleSignin(db, bcrypt)); //function compose req, res

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db));

app.get('/profile/:id', (req, res) => profile.handleProfileGet(req, res, db));

app.put('/image', (req, res) => image.handleImage(req, res, db));

app.post('/imageUrl', (req, res) => image.handleApiCall(req, res));

app.listen(4001, () => {
    console.log('app is running on port 4001');
})