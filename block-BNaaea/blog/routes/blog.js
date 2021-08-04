var express = require("express")
var router = express.Router()
var Article  = require("../models/Article")
var Comment = require("../models/Comment")

var auth = require("../middlewares/auth")


router.get("/" , (req,res,next)=> {
    Article.find({} , (err,articles)=> {
     if(err) return next(err)
     res.render("articles.ejs" ,  {articles:articles})
    })
})


// create article form
router.get("/new" , auth.loggedInUser , (req,res)=> {
    res.render("addArticle.ejs")
})

router.get("/:id" , (req,res,next)=> {
    var id =req.params.id
    Article.findById(id).populate("comments").populate("author" , "name email").exec((err ,article)=> { //populate internally grab id and fetch comments from comments model
        console.log(err,article)
        if(err) return next(err)
        res.render("articleDetails.ejs" , {article:article})
    }) 
    
})


router.use(auth.loggedInUser)




/*router.get("/:id" , (req,res,next)=> {
    var id =req.params.id
    //handle here
    
    Article.findById(id , (err,article)=> {
        
        if(err) return next(err)
        res.render("articleDetails.ejs" , {article:article})
    })
})*/







router.post("/" , (req,res,next)=> {
    req.body.tags =req.body.tags.trim().split(" ")  //req.body contain data coming from form addArticle.ejs
    req.body.author =  req.user._id  // req.user give us detail of current logged in user . And here we are able to save it in database
   Article.create(req.body , (err , createdArticle)=> {
    console.log(req.body)
       if(err) return next(err)
       res.redirect("/articles")
   })
})


//Edit article form

router.get("/:id/edit"  , (req,res,next)=> {
    var id =req.params.id
    
    Article.findById(id , (err,article)=> {
        article.tags =article.tags.join(" ")

       
        if(err) return next(err)
        if(article.author._id.toString() === req.user._id.toString() ) {
            res.render("editArticleForm.ejs", {article:article})  
        }

        else {
            res.redirect("/users/login")
        }
        
    })
})


//save updated data
router.post("/:id" , (req,res,next)=> {
    var id = req.params.id
    req.body.tags =req.body.tags.split(" ")
    Article.findByIdAndUpdate(id,req.body,(err,updatedArticle)=> {
        
        if(err) return next(err)
        res.redirect("/articles/"+id)
    })
})


//delete article
router.get("/:id/delete"  , (req,res,next)=> {
    var id =req.params.id
  
    //check whether current logged in user matches with author of article .   req.user.id = information of logged in user . article.author._id is id of author of article .
     Article.findById(id , (err , article)=> {
         if(err) return next(err)
        if(article.author._id.toString() === req.user._id.toString() )  {
           
            Article.findByIdAndDelete(id, (err,article)=> {
                if(err) return next(err)
                res.redirect("/articles")
            })
        }

    
    
        else {
            console.log(article.author._id , req.user._id)
          res.redirect("/users/login")
        }
     })
    
    
})

//increment likes
router.get("/:id/likes" , (req,res,next)=> {
    var id =req.params.id
    Article.findByIdAndUpdate(id , {$inc:{likes:1}} , (err,article)=> {
        if(err) return next(err)
        res.redirect("/articles/"+id)
    })

})

//decrement likes
router.get("/:id/dislikes"  , (req,res,next)=> {
    var id =req.params.id
    Article.findByIdAndUpdate(id , {$inc:{likes:-1}} , (err ,article)=> {
        if(err) return next(err)
        res.redirect("/articles/"+id)
    })
})


//create comments
router.post("/:id/comments"  ,(req,res,next)=> {
    var id = req.params.id
    req.body.articleId  = id
    Comment.create(req.body , (err , comment)=> {
        if(err) return next(err)
        console.log(err,comment)
        //update book with comment id into comments section
        Article.findByIdAndUpdate(id , {$push:{comments:comment._id}} , (err ,updatedArticle)=> {
            console.log(err,updatedArticle)
            if(err) return next(err)
            
            res.redirect("/articles/"+id)

        })

        
    })
} )

module.exports=router