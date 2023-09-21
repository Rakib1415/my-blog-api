const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {controllers : artileController} = require('../api/v1/article');


router
    .route('/api/v1/articles')
    .get(artileController.findAll)
    .post(authenticate, artileController.create)

router
    .route('/api/v1/articles/:id')
    .get(artileController.findSingleItem)
    .put(() => {})
    .patch(() => {})
    .delete(() => {})    

module.exports = router;