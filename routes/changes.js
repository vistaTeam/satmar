const router = require('express').Router();
let bodyParser = require('body-parser')
let Change = require('../models/changes.model');
const path = require('path')
const fs = require('fs');
const { log } = require('console');



router.route('/getthechanges').get((req, res)=>{
    Change.find()
    .then(changes => res.json(changes))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/findchange/:id').get((req, res, next)=>{
    Change.findById(req.params.id)
    .then((data)=> res.json(data),console.log('Log in good!'))
    .catch(err => res.status(400).json('eror ' + err))
})


router.route('/newchange').post((req, res)=>{
    var data = req.body.data;
    const newChange = new Change(data)
    newChange.save()
    .then(() => res.json('New change exepted!'))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/deletechange/:id').delete((req, res)=>{
    Change.findByIdAndDelete(req.params.id)
    .then(()=> res.json('user deleted!!!'))
    .catch(err => res.status(400).json('eror ' + err))
});




module.exports = router;
