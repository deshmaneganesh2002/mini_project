// for installing mongoose use => npm i mongoose
//then import mongoose
const mongoose=require("mongoose");

//connecting db to node
mongoose.connect('mongodb://localhost:27017/mini_project');

//creating schema & applying validation
const user=mongoose.Schema({
    id:{type:Number,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,
        match:/.+\@.+\..+/
    },
    password:{type:String,required:true,
        minlength:8
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }]
});

// creating model
module.exports=mongoose.model("user",user);

