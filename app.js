const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  date = require(`${__dirname}/date.js`),
  mongoose = require('mongoose'),
  _ = require('lodash')

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
  defaultItems = [item1, item2, item3],
  listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema],
  }),
  List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Successfully add items')
        }
      })
      res.redirect('/')
    } else {
      let day = date.getDate()
      res.render('list', { listTitle: day, items: items })
    }
  })
})

app.post('/', (req, res) => {
  const itemName = req.body.newItem

  const item = new Item({
    name: itemName,
  })

  item.save()
  res.redirect('/')
})

app.post('/work', (req, res) => {
  let item = req.body.newItem
  workItems.push(item)
  res.redirect('/work')
})

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox
  function deleteItem(id) {
    Item.findByIdAndRemove(id, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Successfully deleted checked item from DB')
      }
    })
  }
  deleteItem(checkedItemId)
  res.redirect('/')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/:listName', (req, res) => {
  const customListName = req.params.listName

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        })
        list.save()
        res.redirect(`/${customListName}`)
      } else {
        // show an existing list
        res.render('list', {
          listTitle: foundList.name,
          items: foundList.items,
        })
      }
    }
  })
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
