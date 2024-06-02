const mongoose = require("mongoose");
const Joi=require("joi");
const bcrypt=require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    }
  }, {
    timestamps: true
  });

  function joiVelidation(data){
      const schema = Joi.object({
        name: Joi.string()
          .trim()
          .required()
          .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
          }),
        password: Joi.string()
          .min(6)
          .required()
          .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.empty': 'Password is required',
            'any.required': 'Password is required'
          }),
        email: Joi.string()
          .trim()
          .lowercase()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            'string.email': 'Email must be a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
          })
      });

      const {error}= schema.validate(data);
      return error;
  }

  userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try {
        this.password=await bcrypt.hash(this.password,10);
        next();
    } catch (error) {
        console.log("error in bcrypt password.");
    }
  });

  userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
  }

  const userModel=mongoose.model("User",userSchema);
  module.exports={userModel,joiVelidation};