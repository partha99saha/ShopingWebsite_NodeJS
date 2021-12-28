const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }
  save() {
    const db = getDb();
    //update the product
    let dbOp;
    if(this._id){
    dbOp = db.collection('products')
    .updateOne({_id : this._id},{$set: this});
    } 
    else{
    dbOp = db.collection('products')
    .insertOne(this)
    }
    return dbOp
      .then(result => {
        //console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        //console.log(products);
        return products;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static findById(prodID) {
    const db = getDb();
    return db
      .collection('products')
      .find({_id: new mongodb.ObjectId(prodID)})
      .next()
      .then(product => {
        //console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteById(prodID) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({_id: new mongodb.ObjectId(prodID)})
      .then(product => {
        //console.log(product);
        console.log("product deleted");
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = Product;
