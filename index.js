require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');

app.use((req,res,next)=>{
    User.findById('61cf486ab79c7529ecbc650b')
    .then(user=>{
            req.user = user;
            next();
        })
    .catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect('mongodb://127.0.0.1:27017/ShopingWebsite')
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
        const user = new User({
        name : 'test user',
        email : 'user@email.com',
        cart : {
            items : []
        }
    });
    user.save();
        }
    });
    console.log('connected to MongoDB');
})
.catch(err=>{
    console.log(err)
});

const port = process.env.port || 4000 ;
app.listen(port,()=>{
        console.log(`server is running on port:${port}`);
    });
