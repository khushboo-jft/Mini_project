const { default: mongoose } = require("mongoose");

const connectDB=async(DB_URL)=>{
    try{
        const DB_OPTIONS={
            dbName:"Login"
        };
        await mongoose.connect(DB_URL,DB_OPTIONS);
        console.log("connected successfully...")
    }catch(err){
        console.log(err);
    }
};
module.exports=connectDB