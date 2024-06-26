var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongoose = require("mongoose");

String.prototype.toObjectId = function() {
    var ObjectId = mongoose.Types.ObjectId;
    return new ObjectId(this.toString());
};

var app = express();
var config = require('dotenv').config();
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));
//cors
var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false, limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//User Controller
const AccountManagementController = require('./routes/accountManagement');

const SurveyManagementController = require('./routes/surveryAnswers')

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/accountManagement', AccountManagementController);
app.use('/survey', SurveyManagementController);


//MongoDB Connection
mongoose.connect(process.env.MONGO_DB, {})
const db = mongoose.connection

db.on('error', (error) => console.log('Error-', error))
db.once('open', () => console.log('Connected to Database'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
