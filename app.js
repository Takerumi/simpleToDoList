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

// create schema for items
const itemSchema = new mongoose.Schema({
    name: String,
  }),
  // create model for collection of items
  Item = mongoose.model('Item', itemSchema),
  // hardcoded default items
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
  // create schema for lists
  listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema],
  }),
  // create model for collection of lists
  List = mongoose.model('List', listSchema)

app.get('/', (req, res) => {
  // check if items collection is empty before inserting default items
  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Successfully add items')
        }
      })
      // redirect to the root to render default items in list
      res.redirect('/')
    } else {
      // get date from the module and store it in a variable
      let day = date.getDate()
      // render template passing the title of list and collection of items
      res.render('list', { listTitle: day, items: items })
    }
  })
})

app.post('/', (req, res) => {
  // fetch item value & list title from request object
  const itemName = req.body.newItem,
    listName = req.body.list
  // create item document
  const item = new Item({
    name: itemName,
  })
  // check by title which list is currently in use
  if (listName === date.getDate()) {
    // if list is stock save item in default collection
    item.save()
    res.redirect('/')
  } else {
    // search in DB for list with a suitable title
    List.findOne({ name: listName }, (err, foundList) => {
      // if list is found push item there
      foundList.items.push(item)
      foundList.save()
      res.redirect(`/${listName}`)
    })
  }
})

app.post('/delete', (req, res) => {
  // fetch selected with checkbox item & list
  const checkedItemId = req.body.checkbox,
    listName = req.body.listName
  // check by title which list is currently in use
  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log('Successfully deleted checked item')
        res.redirect('/')
      }
    })
  } else {
    // find item with selected checkbox in list
    // and remove it from array using built-in operator MongoDB
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect(`/${listName}`)
        }
      }
    )
  }
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/:listName', (req, res) => {
  // extract route parameters
  // and use lodash method to convert ctring to title case
  const customListName = _.capitalize(req.params.listName)
  // check if list exists in DB
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
