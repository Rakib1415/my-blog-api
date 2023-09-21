require('dotenv').config();
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const OpenApiValidator = require('express-openapi-validator');
const YAML = require('yamljs');

//initialize database file
// const databaseConnection = require('./db');
const mongoose = require('mongoose');

const articleService = require('./services/article');

const swaggerDoc = YAML.load('./swagger.yaml');

// express app
const app = express();

app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: './swagger.yaml',
    }),
  );

  app.use((req, _res, next) => {
    req.user = {
        id : 999,
        name : 'Rakib Hasan'
    };
    next();
  })

// health route
app.get('/health', (_req, res) => {
    res.status(200).json({
        health : "ok"
    })
});

// get list of article route
app.get('/api/v1/articles', async(req, res) => {
    // 1. extract query params
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const sortType = req.query.sort_type || 'dsc';
    const sortBy = req.query.sort_by || 'updatedAt';
    const searchTerm = req.query.search_term || '';

    // 2. call the Article service to fetch all article
    let {articles, totalItems, totalPage, hasNext, hasPrev} = await articleService.findArticles({ page, limit, sortType, sortBy, searchTerm});

    const response = {
        data : articleService.transformArticles({articles}),
        pagination: {
            page,
            limit,
            totalPage,
            totalItems
          },
          links:{
            self : req.url,
          }
    }
    if(hasPrev){
        response.pagination.prev = page - 1;
        response.links.prev = `${req.url}?page=${page - 1}&limit=${limit}`
    }
    if(hasNext){
        response.pagination.next = page + 1;
        response.links.next = `${req.url}?page=${page + 1}&limit=${limit}`
    }

    res.status(200).json(response);
});

// create article route
app.post('/api/v1/articles', async(req, res) => {
    // step 1 : destructure the request body
    const {title, body, cover, status} = req.body;

    // setp 2 : invoke the service funtion to create article and save database
    const article = await articleService.createArticle({title, body, cover, status, authorId : req.user.id});

    // step 3 : generate response
    const response = {
        code : 201,
        message : 'Article created successfully!',
        data : article,
        links : {
            self : `${req.url}/${article.id}`,
            author : `${req.url}/${article.id}/author`,
            comment : `${req.url}/${article.id}/comment`
        }
    };

    res.status(201).json(response);

})

app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

// server listening on port 4000
let connectionURL = process.env.DB_CONNECTION_URL;
connectionURL = connectionURL.replace('<username>', process.env.DB_USERNAME);
connectionURL = connectionURL.replace('<password>', process.env.DB_PASSWORD);
(async() => {
    await mongoose.connect(connectionURL, {dbName : process.env.DB_NAME});
    console.log('Database connection establish successfully!');
    app.listen(4000, () => {
        console.log('Server is running on port 4000');
    })
})();