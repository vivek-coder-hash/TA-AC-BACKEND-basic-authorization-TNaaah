var express = require('express');
var router = express.Router();
var auth = require("../middlewares/auth")

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user) //to check whether user logged in or not
  res.render('index', { title: 'Express' });  // we must be able to use name and email of user in index.ejs from line 18 in auth.js
});

/*make route only accessible to logged in use*/
/*Authorization*/

router.get("/protected" , auth.loggedInUser , (req,res)=> {
 //console.log(req.session)   //userId available inside req.session
   res.send("protected routes")
})   //every protected request has to pass from auth.loggedInUser first . next() will pass execution from auth.loggedInUser to req,res . 

module.exports = router;
