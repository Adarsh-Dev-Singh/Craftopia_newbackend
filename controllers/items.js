const Item = require('../models/Item');
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors');
const cartItems = async (req, res) => {
  console.log(req.user);
  const items = await Item.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ items, count: items.length });
}
const deleteItem = async (req, res) => {
  const {
    user:{userId},
    params:{id:shaash}
} = req
const item = await Item.findByIdAndRemove({_id:shaash,createdBy:userId})
  if(!item){
    throw new NotFoundError(`Cannot find Item with id ${shaash}`);
  }
  res.status(StatusCodes.OK).send(`Item with id ${shaash} and userId : ${userId} is deleted`)
}
const updateItem = async (req, res) => {
  const {
    body: { company, position },
    params: { id: paneer },
    user: { userId }
  } = req
  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position cannot be empty')
  }
  const item = await Item.findByIdAndUpdate({ _id: paneer, createdBy: userId }, req.body, { new: true, runValidators: true })
  res.status(StatusCodes.OK).json({ item })
}
const createItem = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const item = await Item.create(req.body)
  console.log(req.body)
  res.status(StatusCodes.CREATED).json({ item });
}

module.exports = {
  cartItems,
  deleteItem,
  updateItem,
  createItem,
}