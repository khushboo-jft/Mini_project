require('dotenv').config()
const express=require('express');
const router=express.Router();
const {users,emptable} =require('../models/user.js')
const alert=require('alert')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const app=express();




router.get('/reg',(req,res)=>{
    res.render('register')
})

router.post('/register',(req,res)=>{
    try{
        bcrypt.hash(req.body.password,8,async(err,hash)=>{
        // const {name,email}=req.body;
        const doc=new users({
          name:req.body.name,
          email:req.body.email,
          password:hash
        })
        const result=await doc.save()
        console.log(result,"addded")
        res.redirect('/emp/login')

        })
            

    }catch(err){
        console.log(err);
    }
})

router.get('/login',(req,res)=>{
    // console.log("hello");
    res.render('login')

})
router.post('/login',async(req,res)=>{
    
    try {
        const result = await users.findOne({ email: req.body.email});
        if(result==null){
            res.redirect('/emp/reg')
            alert("User Not found with this Email!!!!")
        }
        const isValid=await bcrypt.compare(req.body.password,result.password)
        console.log(isValid)
        if(!isValid){
            res.redirect('/emp/reg')
            alert("password wrong!!!!!")
        }
        
        let token = jwt.sign({ _id: result._id}, process.env.ACCESS_TOKEN_SECRET);
        // console.log(token)
        res.cookie('key',token)
        res.redirect('/emp')
           
    } catch (error) {
        console.log(error);
    }

})
router.use((req,res,next)=>{
    // const token=req.cookies.key;
    // console.log("-----------------",req.cookies);
   
   
    try{
        let user=jwt.verify(req.cookies.key,process.env.ACCESS_TOKEN_SECRET);
        req.users=user._id;
        // console.log(user,"in middleware");
        next();

    }catch(error){
        console.log(error);
    }
    
})
router.post('/reg',(req,res)=>{

    res.clearCookie('key').redirect('/emp/reg')
});
// app.use(auth());
let emp = [];
let editId;
let obj = {

    "emptable": emp,
    "Name": "",
    "Job": "",
    "Salary": "",
    // "admin":""
    
}
function clear(){
    obj.Name="",
    obj.Job="",
    obj.Salary=""
    
}
router.get('/',async(req,res)=>{
    try{
        const result=await emptable.find({admin:req.users})
        // console.log(result)
        emp=[...result]
        obj={...obj,"emp":emp}
        res.render("index",obj)

    }catch(err){
        console.log(err)
    }
})
router.post('/',async (req,res)=>{
    try{
        const {Name,Job,Salary}=req.body;
        // console.log(req.users,"incontroller")
        let doc = await emptable.create({
                Name:Name,
                Job:Job,
                Salary:Salary,
                admin:req.users,
            })
        
        res.redirect('/emp');
       
    }catch(err){
        console.log(err);
    }
    
})

router.post('/delete/:id',async( req,res)=>{
    try {
        const result= await emptable.findByIdAndDelete(req.params.id,(err)=>{
            if(err) console.log(err);
            res.redirect('/emp')
        })
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/:id',async(req,res)=>{
    try {
        const result=await emptable.findById(req.params.id).find()
        // console.log(result,"edit")
        obj.Name = result[0].Name;
        obj.Job = result[0].Job;
        obj.Salary = result[0].Salary;
        // obj.admin=result[0].admin;
        editId = result[0]._id;
        
        res.redirect('/emp')

        
    } catch (error) {
        console.log(error);
    }

})

router.post('/save/:id',async(req,res)=>{
    try {
        const result=await emptable.findByIdAndUpdate({_id:editId},req.body,{new:true},(err)=>{
            if(err) console.log(err);
            clear()
            res.redirect('/emp')
        })
        
    } catch (error) {
        console.log(error);
    }
})





module.exports=router;