const express=require('express');
const connectDB=require('./database.js')
const app=express();
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const router=require('./routes/route.js');
const cookieParser=require("cookie-parser")
// const controller=require('./controllers/controller.js')
const port=3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));
app.use(cookieParser())
app.set('view engine', 'ejs');
const DB_URL=process.env.DB_URL||"mongodb://localhost:27017/Login";
mongoose.set('strictQuery', false);
connectDB(DB_URL);
app.use("/emp",router)


app.listen(port,()=>{
    console.log("server running")
})