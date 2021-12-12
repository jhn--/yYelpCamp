// express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

// express
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_m'));
app.set('view engine', 'ejs');
// app.set('views', [process.cwd() + '/views/frontend', process.cwd() + '/views/backend'])
app.set('views', path.join(__dirname, '/views/frontend'), path.join(__dirname, '/views/backend'))

const _port = 8888;
app.listen(_port, () => {
    console.log(`yYelpCamp, listening on ${_port}`);
})

const { _feIndex, _fe404 } = require('./routes/frontend/app');

// frontend
app.get('/', _feIndex);

// 404s
app.get('*', _fe404);