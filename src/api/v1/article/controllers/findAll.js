const articleService = require('../../../../lib/article');
const defaults = require('../../../../config/defaults');
const {query} = require('../../../../utils')

const findAll = async(req, res, next) => {
    const page = req.query.page || defaults.page;
    const limit = req.query.limit || defaults.limit;
    const sortType = req.query.sort_type || defaults.sortType;
    const sortBy = req.query.sort_by || defaults.sortBy;
    const search = req.query.search || defaults.search;

    try{
        const articles = await articleService.findAll({
            page,
            limit,
            sortType,
            sortBy,
            search
        });
        // data
        const data = query.getTransformedItems({items : articles, selection : ['id', 'title', 'cover', 'author', 'updatedAt', 'createdAt'], path : '/articles'});

        // pagination
        const totalItems = await articleService.count({search});
        const pagination = query.getPagination({totalItems, limit, page});

        // Hateaous or links
        const links = query.getHateOASForAllItems({url : req.url, path : req.path, query : req.query, page, hasNext : !!pagination.next, hasPrev : !!pagination.prev});
        const response = {
            data,
            pagination,
            links
        }
        res.status(200).json(response);

    }catch(e){
        next(e);
    }
}

module.exports = findAll;