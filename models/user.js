const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema({
            name: String,
            password: String,
            email:String
        });

const users= mongoose.model("users", userSchema);


const emp=new mongoose.Schema({
    Name:{
            type:String,
            
        },
    Job:{
            type:String,
           
        },
    Salary:{
            type:Number,
            
        },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },    
    
    
});        






const emptable=mongoose.model("emptable",emp) ;
module.exports={
    emptable,users
}