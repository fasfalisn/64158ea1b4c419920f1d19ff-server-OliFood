
const { UserUserimageSchema } =require('./UserUserimage');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
Underscoreid:String , 


useremail:String , 


password:String , 


username:String , 


usercategory:String , 


userstatus:String , 


userimage:  
UserUserimageSchema
 , 


mondayclose:String , 


mondayopen:String , 


tuesdayopen:String , 


tuesdayclose:String , 


wednesdayopen:String , 


wednesdayclose:String , 


thursdayclose:String , 


thursdayopen:String , 


fridayopen:String , 


fridayclose:String , 


usertown:String , 


userregion:String , 


useraddress:String , 


userpc:Number , 




 userproducts: [ 
  {
    type: Schema.Types.ObjectId,
    ref:'product'
  }

]



})

module.exports = {
  User : mongoose.model('user', userSchema),
}

