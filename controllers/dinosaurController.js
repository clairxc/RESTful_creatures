const express = require('express')
const router = express.Router()
const fs = require('fs')

// index route -- list all the dinos!
router.get('/', (req, res) => {
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

    res.render('dinosaurs/index.ejs', {myDinos: dinoData}) // render the dinodata to our ejs
})

// new route (renders the new dino form)
// this has to be placed ABOVE the show route because
router.get('/new', (req, res)=>{
    res.render('dinosaurs/new.ejs')
})

// edit form route (renders edit form)
router.get('/edit/:idx', (req, res)=>{
    // copied and pasted from below
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx parameter
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    // snatch the dino to be updated
    res.render('dinosaurs/edit.ejs', {dino: targetDino, dinoId: dinoIndex})
})

// PUT ROUTE
router.put('/:idx', (req, res)=>{
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
router.get('/:idx', (req, res) => {
    // read in the dinos from the dinosaurs.json file
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    // extract the dino corresponding to the idx parameter
    // console.log('idx:'+req.params.idx)
    let dinoIndex = req.params.idx
    let targetDino = dinoData[dinoIndex]
    // console.log(dinoData)
    res.render('/dinosaurs/show.ejs', {dino: targetDino})
})

// post a new dino
router.post('/', (req, res)=>{
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

// delete
router.delete('/:idx', (req, res)=>{
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



module.exports = router


