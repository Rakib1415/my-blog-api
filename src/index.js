require('dotenv').config();
const http = require('http');
const app = require('./app');
const {connectDB} = require('./db');


const server = http.createServer(app);

const port = process.env.PORT || 4000;

const main = async() => {
    try{
        await connectDB();
        console.log('Database connection established successfully!');
        server.listen(port, () => console.log(`Listening on port ${port}`))
        

    }catch(err){
        console.log('Database connection error');
        console.log(err);
    }

};

main();