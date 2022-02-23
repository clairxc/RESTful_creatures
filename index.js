// import packages
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override')


// create instance of express
const app = express()


// MIDDLEWARE
// tell express to use ejs as the view engine
app.set('view engine', 'ejs')
// tell express that we're using ejs layouts
app.use(ejsLayouts)
// method override (needs to above body parser middleware bc if we put it below then body-parser middleware will throw everything into the req.body too quickly )
app.use(methodOverride('_method'))
// body-parser middleware
// this tells express how to handle incoming data
// this allows us to access form data via req.body
// should just memorize this
app.use(express.urlencoded({extended: false}))

// controller middleware should go below ALL other middleware

// ROUTES
// home route
app.get('/', (req, res) => {
    res.send('Hello Dinos') // we didn't change this to res.render bc we dont care about this
})


// req.body -- we use this when we use POST (when we're trying to send new data)
// req.query -- we use this when we use GET (when we're trying to get data)


// // // // // // // // // // // // // //

app.use('/dinosaurs', require('./controllers/dinosaurController.js'))
// LAB
// moved to prehistoric controller folder
app.use('/prehistoric_creatures', require('./controllers/prehistoricController.js'))



app.listen(8000, () => {
    console.log('DINO CRUD TIME 🦖')
})
