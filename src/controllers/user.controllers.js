const express = require('express');

const { body , validationResult } = require('express-validator');

const Product = require('../models/user.models');

const router = express.Router();

router.post(
  '/',
  body('first_name')
  .notEmpty()
  .withMessage('first name is required') ,
  body('last_name')
  .notEmpty()
  .withMessage('Last name is required') ,
  body('email')
  .custom(async (value) =>{
    const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
    if (!isEmail){
      throw new Error('please enter proper email address')
    }
    const productByEmail = await Product.findOne({ email: value}).lean().exec();
    if (productByEmail){
      throw new Error('please try with a different email address')
    }
    return true;
  })
  .notEmpty()
  .withMessage('Email is requied and it has to be unique') ,
  body('pincode')
  .notEmpty()
  .isLength({min:6,max:6})
  .withMessage('Please Provide valid pincode , pincode has to be 6 charecter'),
  body('gender')
  .notEmpty()
  // .custom(function(value) {
  //   if(value !== "Male" || value !== "Female" || value !== "Others"){
  //     throw new Error('Gender must be Male , Female or Others')
  //   } 
  //   return true
  // })
  // .withMessage('Gender must be Male , Female or Others'),
  .withMessage("gender is required").isIn(["Male", "Female","Others"]).withMessage("Gender must be Male , Female or Others"),

  body('age')
  .custom(value => {
    const isNumber = /^[0-9]*$/.test(value) 
    if(!isNumber || value <= 0 || value > 100){
      throw new Error('age can not 0 or negative or any string , age must be between 1 and 100')
    }
    return true
  })
  .notEmpty()
  .withMessage('Email is requied and it has to be unique'),
  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){

      let newError = errors.array().map(({msg,param, location})=>{
        return{
        [param]:msg,
        }
      
      });
      return res.status(400).json({errors:newError});
    }
 
    try {
        const products = await Product.create(req.body);

        return res.status(201).json({products});
      }catch (e) {
        return res.status(500).json({ message: e.message, status: "Failed" });
      }
})




module.exports = router;