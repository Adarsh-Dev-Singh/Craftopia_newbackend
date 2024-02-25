const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
// const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bycrypt = require('bcryptjs');
const register = async (req, res) => {
  // const {name , email,password} = req.body;
console.log(req.body);
// const namak = await bycrypt.genSalt(10);
// const hashedPassword = await bycrypt.hash(password,namak);
// const tempUser = {name , email , password:hashedPassword}
  const user = await User.create({ ...req.body });
  // const token = jwt.sign({userId:user._id,name:user.name},'jwtsecret',{expiresIn: '30d',})
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    throw new BadRequestError('Please provide email and passsword');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Credentials are not valid");
  }
  const passwordSahiHa = await user.comparePassword(password);
  if(!passwordSahiHa){
    throw new UnauthenticatedError("Credentials are not valid");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = {
  login,
  register,
}