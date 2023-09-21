const {Article} = require('../../models');


const findAll = async({page = 1, limit = 10, sortType = 'dsc', sortBy = 'updatedAt', search = ''}) => {

    const sortStr = `${ sortType === 'dsc' ? '-' : ''}${sortBy}`;
    const filter = {
        title : { $regex : search, $options : 'i'}
    };
    const articles = await Article.find(filter).populate({path : 'author', select : 'name'}).sort(sortStr).skip(page*limit - limit).limit(limit);
    return articles.map((article) => ({
        ...article._doc,
        id : article.id,
    }));
}

const count = ({ search = ''}) => {
    const filter = {
        title : { $regex : search, $options : 'i'}
    };

    return Article.count(filter);
}

const create = async({title, body = '', cover = '', status = 'draft', author}) => {
    if(!title || !author){
        throw new Error('Invalid Parameters!');
    }

    const article = new Article({
        title,
        body,
        cover,
        status,
        author : author.id
    });

    await article.save();
    return {
        ...article._doc,
        id : article.id
    }
};

const findSingleItem = async({id, expand = ''}) => {
    if(!id) throw new Error('Id is required!');
    expand = expand.split(",").map((item) => item.trim());
    const article = await Article.findById(id);
    if(!article) throw new Error('There is no article corresponding id')
    if(expand.includes('author')){

        await article.populate({
            path : 'author',
            select : 'name',
           strictPopulate : false
        })
    }
    if(expand.includes('comment')){
        await article.populate({
            path : 'comments',
            strictPopulate : false
        })
    }

    return {
        ...article._doc,
        id : article.id
    }
}

module.exports = {
    create,
    findAll,
    findSingleItem,
    count
}