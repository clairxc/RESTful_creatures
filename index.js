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
// index route -- list all the dinos!
app.get('/dinosaurs', (req, res) => {
    // read in the array from dinosaurs.json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // res.send(dinoData) // this gives us json files in the browser
    // console.log(req.query)
    // grabbing the queried name from the url
    let nameFilter = req.query.nameFilter
    // if there IS a query,
    if(nameFilter){
        // filter out all dinos who don't have the queried name
        dinoData = dinoData.filter(dino=>{
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }

    res.render('index.ejs', {myDinos: dinoData}) // render the dinodata to our ejs
})

// new route (renders the new dino form)
// this has to be placed ABOVE the show route because
app.get('/dinosaurs/new', (req, res)=>{
    res.render('new.ejs')
})

// edit form route (renders edit form)
app.get('/dinosaurs/edit/:idx', (req, res)=>{
    // copied and pasted from below
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx parameter
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    // snatch the dino to be updated
    res.render('edit.ejs', {dino: targetDino, dinoId: dinoIndex})
})

// PUT ROUTE
app.put('/dinosaurs/:idx', (req, res)=>{
    // read in our existing dino data
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // replace dino fileds with field from form
    // dinoData[req.params.idx] gives us access to the dinosaur we want to edit
    dinoData[req.params.idx].name = req.body.name
    dinoData[req.params.idx].type = req.body.type
    // write the updated array back to the json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData)) 
    // once the dinosaur has been edited, redirect back to index route
    // res.redirect takes the url pattern for the GET route that 
    res.redirect('/dinosaurs')
})

// show all info about a single dino
// : indicates that the following is a url parameter
app.get('/dinosaurs/:idx', (req, res) => {
    // read in the dinos from the dinosaurs.json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx parameter
    // console.log('idx:'+req.params.idx)
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    // console.log(dinoData)
    res.render('show.ejs', {dino: targetDino})
})

// post a new dino
app.post('/dinosaurs', (req, res)=>{
    // console.log(req.body)
    // read in our dino data from the json file (same as above)
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // add new dino to the dinoData array -- can just push it
    dinoData.push(req.body)
    // save the dinosaurs to the json file
    // writeFileSync will OVERWRITE, not ADD to the existing data
    // JSON.stringify does the opposite of json.parse-- it converts the data back into json data
    // every time we parse a JSON file, we need to stringify it to get it back to it's "original" data type
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData)) 
    // redirect back to the index route
    // res.redirect takes the url pattern for the ger route that you want to run next
    res.redirect('/dinosaurs')
})


app.delete('/dinosaurs/:idx', (req, res)=>{
    // read in our dinos from our json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // remove the deleted dino from dinoData 
    dinoData.splice(req.params.idx, 1) // 1 represents how many items you want to get rid of
    // write the updated array back to the json file 
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData)) 
    // redirect
    res.redirect('/dinosaurs')
})

// req.body -- we use this when we use POST (when we're trying to send new data)
// req.query -- we use this when we use GET (when we're trying to get data)


// // // // // // // // // // // // // //

// LAB
// moved to prehistoric controller folder
app.use('/dinosaurs', require('./controllers/dinosaurController.js'))
app.use('/prehistoric_creatures', require('./controllers/prehistoricController.js'))



app.listen(8000, () => {
    console.log('DINO CRUD TIME 🦖')
})
