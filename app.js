const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000

let items = ['Buy bread', 'Buy cheese', 'By sausages']

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  const today = new Date(),
    options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
  let day = today.toLocaleDateString('en-US', options)

  res.render('list', { day: day, items: items })
})

app.post('/', (req, res) => {
  let item = req.body.newItem
  items.push(item)
  res.redirect('/')
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
