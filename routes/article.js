const express=require('express');
// article model
let Article=require('../models/article');
const passport=require('passport');
// user model
let User=require('../models/user');
let router=express.Router();

router.get('/add', ensureAuthenticated, function(req, res) {
    
    res.render('add', {
        title:'Articles',
        header:'Add a new article'
    });
});

// Add submit post route
router.post('/add',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
//   req.checkBody('author','author is required').notEmpty();
  req.checkBody('body','body is required').notEmpty();
  
//   get errors
  let errors=req.validationErrors();
  if(errors){
      res.render('add',{
          title:'Add Article',
          errors:errors
      });
  }else{
    let article=new Article();
    article.title=req.body.title;
    article.author=req.user._id;
    article.body=req.body.body;
    article.save(function(err){
        if (err) {
            console.log(err);
        }else{
            req.flash('success','Article added');
            res.redirect('/');
        }
    });
  }
});

// get single article route
router.get('/:id',function(req,res){
  Article.findById(req.params.id, function(err, article){
      User.findById(article.author,function(err,user){
        res.render('article', {
            article:article,
            author:user.name
        });
      });
    
  });
});

//edit article route
router.get('/edit/:id',ensureAuthenticated,function(req,res){
    Article.findById(req.params.id, function(err, article){
        if(article.author!=req.user.id){
            req.flush('danger','Unauthorised Acces');
            res.redirect('/');
        }
        res.render('edit', {
            article:article
        });
    });
   
});
//edit article post route
router.post('/edit/:id',function(req,res){
   let article={};
   article.title=req.body.title;
   article.author=req.body.author;
   article.body=req.body.body;
   let query={_id:req.params.id}
   Article.update(query,article,function(err){
       if (err) {
          console.log(err); 
       }else{
           req.flash('success','Article Edited')
           res.redirect('/');
       }
   });
});
//delete article request route
router.delete('/:id',function(req,res){
    if(!req.user._id){
       res.status(500).send();
    }
    let query={_id:req.params.id};
    Article.findById(req.params.id,function(err,article){
        if(article.author!=req.user._id){
            res.status(500).send();
        }else{
            Article.remove(query,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    req.flash('success','Article deleted')
                    res.send('Succes');
                }
            });
        }
    });
    
});

// access control
function ensureAuthenticated(req,res,next){
    
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger','please login');
        res.redirect('/');
    }
}
module.exports=router;