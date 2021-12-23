require('dotenv').config()

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');

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

app.use((req,res,next)=>{
    User.findAll({where:{id:1}})
    .then(user=>{
        req.user = user;
        next();
    })
    .catch(err=>console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constrains : true, onDelete : 'CASCADE'})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:CartItem}); 
Product.belongsToMany(Cart,{through:CartItem});


sequelize
// .sync({ force: true })
.sync()
.then(result=>{
    //console.log(result);
    const user = User.findAll({where:{id:1}});
    if(!user){
        return User.create({name:'max',email:"test@email.com"})
    }
    return user;
})
.then(user=>{
    //console.log(user);
    return Cart.create();
})
.catch(err=>{
    console.log(err);
});

app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
});

