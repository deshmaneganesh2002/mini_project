const express=require('express');
const app=express();
const userModel=require("./models/app_model");
const postModel=require("./models/posts_model");
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const isLoggedIn=require("./middleware/isLoggedIn");



app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.render("index")
})

app.get('/login',(req,res)=>{
    res.render("login")
})

app.get("/profile",isLoggedIn, async (req,res) => {
     let user= await userModel.findOne({email: req.user.email}).populate("posts");
    console.log(user);
    res.render("profile",{user}); // render to profile page
})

app.get("/edit/:id", isLoggedIn, async (req,res)=>{
    let post= await postModel.findOne({_id: req.params.id}).populate("user");
    res.render("edit",{post});
})


//user 

app.post('/register', async (req,res)=>{
       let {id,name,email,password}=req.body;
    
       let user=await userModel.findOne({email});
        if(user) return res.status(500).send("user already registered");

        bcrypt.genSalt(8,(err,salt)=>{
            bcrypt.hash(password,salt , async (err,hash) => {
            let createdUser= await userModel.create({
                id,
                name,
                email,
                password: hash,
            });
            let token=jwt.sign({email: email,userid:userModel._id},"xyz");
            res.cookie("token",token);
           // res.send("user registered successfully",createdUser);
           res.render("login")
           console.log("user registered Successfully");
           
        })
    })
})

exports.login= app.post('/login', async(req,res)=>{
    let user=await userModel.findOne({email: req.body.email});

    if(!user){
        return res.send("Something went Wrong !!");
    }

    bcrypt.compare(req.body.password,user.password, (err,result)=>{
        if(result){
           let token= jwt.sign({email:user.email},"abcdefg");
            res.cookie("token",token);
            res.status(200).redirect("/profile");
            console.log("user Logged in Successfully");
            
        }else{
            res.redirect("/login");
        }
    })

})

app.post('/logout',(req,res)=>{
    res.cookie("token","");
    console.log("Logout Successfully")
    res.redirect("/login");
})


app.post("/post",isLoggedIn,async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    let {content}=req.body


    let post= await postModel.create({
        user:user._id,
        content
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile") //redirect to profile
})

//post or blog

app.get("/like/:id",isLoggedIn,async (req , res) =>{
    let post = await postModel.findOne({_id: req.params.id}).populate("user");

    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1);
    }

    await post.save();
    res.redirect("/profile");
})


app.post("/update/:id", isLoggedIn, async (req,res)=>{
    let updated_post= await postModel.findOneAndUpdate({_id:(req.params.id)},{content: req.body.content},{new:true});
    console.log("update post successfully",updated_post);
    
    res.redirect("/profile");
});


app.post("/delete/:id", isLoggedIn, async (req,res)=>{
    let deletedpost= await postModel.findOneAndDelete({_id:(req.params.id)},{new:true})
    console.log("post deleted successfully",deletedpost)
    res.redirect("/profile");
});









// for authentication to see user logged in or not



const port=3001;
app.listen(port,()=>{
    console.log("Server Started Successfully at " , port)
})