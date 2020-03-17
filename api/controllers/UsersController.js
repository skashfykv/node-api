const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.index = (req, res, next) =>{
  User.find()
  .select("_id email")
  .exec()
  .then( users =>{
      const response = {
          count: users.length,
          users: users.map( user =>{
              return {
                  _id: user._id,
                  email: user.email
              }
          })
      }
      res.status(200).json(response);
  })
  .catch()
}

exports.show = (req, res, next) =>{
  const id = req.params.userID;
  User.findById(id)
  .select("_id email")
  .exec()
  .then(user => {
      if(user){
          res.status(200).json({
              user: user,
          });
      }else{
          res.status(200).json({
              message: 'User Not Found'
          });
      }
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  })
}

exports.create = (req, res,next) =>{
  User.find({email:req.body.email})
      .exec()
      .then(user =>{
          if(user.length){
              return res.status(500).json({
                  message: "User email already exist !"
              });
          }
          bcrypt.hash(req.body.password,10,function (err, hash) {
              if(err){
                  return res.status(500).json({
                      error: err
                  })
              }else{
                  const user = new User({
                      _id: new mongoose.Types.ObjectId(),
                      email: req.body.email,
                      password: hash
                  });
                  user.save()
                  .then(result => {
                      res.status(201).json({
                          message: "User created successfully !",
                      });
                  }).catch(err => {
                      console.log(err);
                      res.status(500).json({
                          error: err
                      });
                  })
              }
          })

      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          });
      })
}

exports.destroy = (req, res, next) =>{
  const id = req.params.userID;
  User.deleteOne({_id:id})
  .exec()
  .then(result => {
      res.status(200).json({
          message: 'User deleted !'
      });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  })
}

exports.login = (req, res, next) =>{
  User.findOne({email:req.body.email})
  .exec()
  .then(user =>{
      if(user){
          bcrypt.compare(req.body.password, user.password, function(err, result) {
              if(result === true){
                  const token = jwt.sign({
                      userId: user._id,
                      email: user.email
                  },process.env.JWT_SECRET_KEY,{
                      expiresIn: '3h'
                  });
                  res.status(200).json({
                      message: 'Auth successfull !',
                      token: token
                  });
                  
              }else{
                  res.status(401).json({
                      message: 'Auth failed !'
                  });
              }
          });
      }else{
          res.status(401).json({
              message: 'Auth failed !'
          });
      }
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      });
  })
}