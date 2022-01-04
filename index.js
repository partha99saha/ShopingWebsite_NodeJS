require('dotenv').config()

const path = require('path');
const express = require('express');
const app = express();
const csrf = require('csurf');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri : process.env.MONGODB_URI,
    collection : 'sessions'
});
const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const Product = require('./models/product');
const User = require('./models/user');
// const Cart = require('./models/cart');2


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : 'my secret',
    resave:false,
    saveUninitialized:false,
    store:store
}));

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URI)
.then(result=>{
    console.log('connected to MongoDB');
})
.catch(err=>{
    console.log(err)
});

const port = process.env.port || 4000 ;
app.listen(port,()=>{
        console.log(`server is running on port:${port}`);
    });
