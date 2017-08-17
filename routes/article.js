const express=require('express');
let Article=require('../models/article');
let router=express.Router();

router.get('/add', function(req, res) {
    
    res.render('add', {
        title:'Articles',
        header:'Add a new article'
    });
});

// Add submit post route
router.post('/add',function(req,res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','author is required').notEmpty();
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
    article.author=req.body.author;
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
    res.render('article', {
        article:article
    });
  });
});

//edit article route
router.get('/edit/:id',function(req,res){
    Article.findById(req.params.id, function(err, article){
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
    let query={_id:req.params.id};
    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }
        else{
            req.flash('success','Article deleted')
            res.send('Succes');
        }
    });
});
module.exports=router;