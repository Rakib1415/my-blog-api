const defaults = require('../config/defaults');
const {generateQueryString} = require('./qs');

const getPagination = ({totalItems = defaults.totalItems, limit = defaults.limit, page = defaults.page}) => {
    const totalPage = Math.ceil(totalItems / limit);
    const pagination = {
        page,
        limit,
        totalItems,
        totalPage
    };
    if(page > 1){
        pagination.prev = page - 1;
    }
    if(page < totalPage){
        pagination.next = page + 1;
    }
    return pagination;
};

const getHateOASForAllItems = ({url = '/', path = '', query = {}, page = 1, hasNext= false, hasPrev = false}) => {
    const links = {
        self : url
    };
    if(hasNext){
        const queryString = generateQueryString({...query, page : page + 1});
        links.next = `${path}?${queryString}`;
    }
    if(hasPrev){
        const queryString = generateQueryString({...query, page : page - 1});
        links.prev = `${path}?${queryString}`;
    }
    return links;
}

const getTransformedItems = ({items = [], selection = [], path = '/'}) => {
    if(!Array.isArray(items) || !Array.isArray(selection)){
        throw new Error('Invalid arguments!');
    }

    if(selection.length === 0){
        return items.map((item) => ({
            ...item,
            link : `${path}/${item.id}`
        }))
    }
    return items.map((item) => {
        const result = {};
        selection.forEach((key) => {
            result[key] = item[key];
        });
        result.link = `${path}/${item.id}`;
        return result;
    })
}

module.exports = {
    getPagination,
    getHateOASForAllItems,
    getTransformedItems,
}