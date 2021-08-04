var mongoose =require("mongoose")
var Schema = mongoose.Schema

var articleSchema = new Schema({
    title: {type:String , require:true} ,
    description:{type:String , require:true} ,
    tags:[String] ,
    author:{type:Schema.Types.ObjectId , ref:"User" , required :true} ,
    likes : {type:Number , default:0} ,
    comments:[{type:Schema.Types.ObjectId , ref:"Comment"}]

}, {timestamps:true})


var Article = mongoose.model("Article" , articleSchema)
module.exports=Article