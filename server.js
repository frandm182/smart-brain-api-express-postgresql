const express = require("express");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-node');
const cors = require('cors');
const knex = require('knex');

const db =knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'travis',
        database: 'smart-brain'
    }
});

// db.select('*').from('users').then(data =>  {
//     console.log(data)
// });

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
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credential')
        }
        
    })
    .catch(err => res.status(400).json('wrong credentials'))
});

app.post('/register', (req, res) => {
    
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        console.log('users')
        trx.insert({ hash, email })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log('users')
            return trx('users')
                .returning('*')
                .insert({
                    name,
                    email: loginEmail[0],
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })    
    .catch(err => res.status(400).json('unable to register'));
    
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
        if(user.length) res.json(user[0]);
        else res.status(400).json('Not found')
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})



app.listen(4001, () => {
    console.log('app is running on port 4001');
})