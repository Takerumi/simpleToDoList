const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  date = require(`${__dirname}/date.js`)

let items = [],
  workItems = []

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

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
