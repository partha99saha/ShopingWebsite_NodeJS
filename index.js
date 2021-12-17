require('dotenv').config()

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { log } = require('console');

//const db = require('./util/database.js');

// db.execute('SELECT * FROM products')
// .then(result =>{
//     console.log(result[0],result[1]);
// })
// .catch(err=>{
//     console.log(err);
// });

//db.end();
const port = process.env.port || 4000 ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(port,()=>{
    console.log("server started");
    console.log(port);
});

