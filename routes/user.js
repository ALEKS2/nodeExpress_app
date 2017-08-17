const express=require('express');
const bcrypt=require('bcryptjs');
let router=express.Router();
//bring in the user model
let User=require('../models/user');

//register form
router.get('/register',function(req,res){
    res.render('register');
});
//register post route
router.post('/register',function(req,res){
    let name=req.body.name;
    let email=req.body.email;
    let username=req.body.username;
    let password=req.body.password;
    let password2=req.body.password2;
    
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('email','Email is invalid').isEmail();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    let errors=req.validationErrors();
    if(errors){
        res.render('register',{
          errors:errors
        });
    }else{
        let newUser=new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
              if(err){
                  console.log(err);
              }
              newUser.password=hash;
              newUser.save(function(err){
               if(err){
                   console.log(err);
                   return;
               }else{
                   req.flash('success','you are now registered and can login');
                   res.redirect('/user/login');
               }
              });
            });
        });
    }
});
// login route
router.get('/login',function(req,res){
    res.render('login');
});
module.exports=router;