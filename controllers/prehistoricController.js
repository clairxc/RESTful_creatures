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

// show all info about a single creature
// : indicates that the following is a url parameter
router.get('/:idx', (req, res) => {
    // read in the dinos from the dinosaurs.json file
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    // extract the dino corresponding to the idx parameter
    // console.log('idx:'+req.params.idx)
    let creatureIndex = req.params.idx
    let targetCreature = creatureData[creatureIndex]
    // console.log(dinoData)
    res.render('prehistoric/creature_index.ejs', {creature: targetCreature})
})

// post a new creature
router.post('/', (req, res)=>{
    // console.log(req.body)
    // read in our dino data from the json file (same as above)
    let creatures = fs.readFileSync('./prehistoric_creatures.json')
    let creatureData = JSON.parse(creatures)
    creatureData.push(req.body)
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatureData)) 
    res.redirect('/prehistoric_creatures')
})


module.exports = router