
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
  }

 



})

module.exports = {
  Order : mongoose.model('order', orderSchema),
}

