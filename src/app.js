const express = require('express');
const applymiddleware = require('./middleware');
const routes = require('./routes');

const app = express();

applymiddleware(app);

app.use(routes);

// health route
app.get('/health', (req, res) => {
    res.status(200).json({
        health : "ok",
        user: req.user
    })
});

app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  module.exports = app;