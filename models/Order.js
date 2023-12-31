
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  Underscoreid:String , 


  orderprice:Number , 


  orderstatus:String , 


  ordersupplier:  
    {
      type: Schema.Types.ObjectId,
      ref:'user'
    },

  ordercustomer: 
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },

  orderproducts: [
    {
    orderproduct: {
      type: Schema.Types.ObjectId,
      ref: 'product'
    },
    orderproductquantity: {
      type: Number
    }
  }
  ]
 



});

module.exports = {
  Order : mongoose.model('order', orderSchema),
}

