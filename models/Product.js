
const { UserUserimageSchema } =require('./UserUserimage');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
Underscoreid:String , 


productName:String , 


productPrice:Number , 


productUnit:String , 


productCategory:String , 


productImage:  
UserUserimageSchema
 



})

module.exports = {
  Product : mongoose.model('product', productSchema),
}

