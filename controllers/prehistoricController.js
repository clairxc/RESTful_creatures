const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/', (req, res) => {
    // read in the dinos from the dinosaurs.json file
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    res.render('prehistoric/creature_index.ejs', {myCreatures: creatureData})
})

router.get('/new', (req, res)=>{
    res.render('prehistoric/creature_new.ejs')
})

// edit form route (renders edit form)
router.get('/edit/:idx', (req, res)=>{
    // copied and pasted from below
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    // extract the dino corresponding to the idx parameter
    let creatureIndex = req.params.idx
    let targetCreature = creatureData[creatureIndex]
    // snatch the dino to be updated
    res.render('prehistoric/creature_edit.ejs', {creature: targetCreature, creatureId: creatureIndex})
})


// PUT ROUTE
router.put('/:idx', (req, res)=>{
    // read in our existing dino data
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    // replace dino fileds with field from form
    // dinoData[req.params.idx] gives us access to the dinosaur we want to edit
    creatureData[req.params.idx].name = req.body.type
    creatureData[req.params.idx].type = req.body.img_url
    // write the updated array back to the json file
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatureData)) 
    // once the dinosaur has been edited, redirect back to index route
    // res.redirect takes the url pattern for the GET route that 
    res.redirect('/prehistoric_creatures')
})

// show all info about a single creature
// : indicates that the following is a url parameter
router.get('/:idx', (req, res) => {
    // read in the creatures from the prehistoric_creatures.json file
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    // extract the creature corresponding to the idx parameter
    // console.log('idx:'+req.params.idx)
    let creatureIndex = req.params.idx
    let targetCreature = creatureData[creatureIndex]
    // console.log(creatureData)
    res.render('prehistoric/creature_index.ejs', {creature: targetCreature})
})

// post a new creature
router.post('/', (req, res)=>{
    // console.log(req.body)
    // read in our creature data from the json file (same as above)
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    creatureData.push(req.body)
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatureData)) 
    res.redirect('/prehistoric_creatures')
})

// delete
router.delete('/:idx', (req, res)=>{
    // read in our dinos from our json file
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    // remove the deleted dino from dinoData 
    creatureData.splice(req.params.idx, 1) // 1 represents how many items you want to get rid of
    // write the updated array back to the json file 
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatureData)) 
    // redirect
    res.redirect('/prehistoric_creatures')
})


module.exports = router