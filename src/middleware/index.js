const express = require('express');
const swaggerUI = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const YAML = require('yamljs');
const morgan = require('morgan');
const swaggerDoc = YAML.load('./swagger.yaml');
const authenticate = require('./authenticate');

const applymiddleware = (app) => {
    app.use(express.json());
    app.use(morgan('dev'));
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

    app.use(
        OpenApiValidator.middleware({
            apiSpec: './swagger.yaml',
    }),
  );
};

module.exports = applymiddleware;