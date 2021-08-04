var mongoose =require("mongoose")
var Schema = mongoose.Schema
/*Each comment should have fields:
content of comment
article Id for reference to article
likes
author
timestamps() */

var commentSchema = new Schema({
    content: String ,
    articleId: {type:Schema.Types.ObjectId , ref:"Article" , required:true} ,
    like:{type:Number , default:0} 

}, {timestamps:true})


var Comment = mongoose.model("Comment" , commentSchema)
module.exports =Comment