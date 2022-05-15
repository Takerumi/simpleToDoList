const { name } = require('ejs')

const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  date = require(`${__dirname}/date.js`),
  mongoose = require('mongoose')

require('dotenv').config()

const DB_HOST = process.env.DB_HOST

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(DB_HOST)

const itemSchema = new mongoose.Schema({
    name: String,
  }),
  Item = mongoose.model('Item', itemSchema),
  item1 = new Item({
    name: 'Welcome to your todoList!',
  }),
  item2 = new Item({
    name: 'Hit the + button to add a new item',
  }),
  item3 = new Item({
    name: '<-- Hit this to delete an item',
  }),
  defaultItems = [item1, item2, item3]

Item.insertMany(defaultItems, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Successfully add items')
  }
})

app.get('/', (req, res) => {
  let day = date.getDate()
  res.render('list', { listTitle: day, items: items })
})

app.post('/', (req, res) => {
  let item = req.body.newItem

  if (req.body.list === 'Work') {
    workItems.push(item)
    res.redirect('/work')
  } else {
    items.push(item)
    res.redirect('/')
  }
})

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', items: workItems })
})

app.post('/work', (req, res) => {
  let item = req.body.newItem
  workItems.push(item)
  res.redirect('/work')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
