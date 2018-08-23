var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/', (req, res) => {
    res.redirect('panel.html');
});

module.exports = app;
