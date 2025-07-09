var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

var app = express();

// Database connection
const dbPath = path.join(__dirname, 'goose_cpi.db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes for Goose CPI
app.get('/api/goose-cpi', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const { year, startYear, endYear, limit = 50 } = req.query;

  let query = 'SELECT * FROM goose_cpi';
  let params = [];
  let conditions = [];

  if (year) {
    conditions.push('year = ?');
    params.push(year);
  }

  if (startYear && endYear) {
    conditions.push('year BETWEEN ? AND ?');
    params.push(startYear, endYear);
  } else if (startYear) {
    conditions.push('year >= ?');
    params.push(startYear);
  } else if (endYear) {
    conditions.push('year <= ?');
    params.push(endYear);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY date DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });

  db.close();
});

// API route for available years
app.get('/api/years', (req, res) => {
  const db = new sqlite3.Database(dbPath);

  db.all('SELECT DISTINCT year FROM goose_cpi ORDER BY year', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows.map(row => row.year));
  });

  db.close();
});

// API route for CPI summary
app.get('/api/cpi-summary', (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const { startYear, endYear } = req.query;

  let query = `
    SELECT 
      year,
      AVG(chick_cpi) as avg_chick_cpi,
      AVG(meat_cpi) as avg_meat_cpi,
      COUNT(*) as records_count
    FROM goose_cpi 
  `;
  
  let params = [];
  let conditions = [];

  if (startYear && endYear) {
    conditions.push('year BETWEEN ? AND ?');
    params.push(startYear, endYear);
  } else if (startYear) {
    conditions.push('year >= ?');
    params.push(startYear);
  } else if (endYear) {
    conditions.push('year <= ?');
    params.push(endYear);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' GROUP BY year ORDER BY year DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });

  db.close();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
