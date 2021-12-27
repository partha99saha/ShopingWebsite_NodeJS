require('dotenv').config()

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');



app.use((req,res,next)=>{
    // User.find()
    // .then(user=>{
        //     req.user = user;
        //     next();
        // })
    // .catch(err=>console.log(err));
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

const port = process.env.port || 4000 ;
app.listen(port,()=>{
        console.log(`server is running on port: ${port}`);
    });

 mongoConnect(()=>{
    console.log('connected to MongoDB');
 })