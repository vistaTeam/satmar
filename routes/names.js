const router = require('express').Router();
let bodyParser = require('body-parser')
let Name = require('../models/names.model');
const path = require('path')
const fs = require('fs');
const { log } = require('console');



router.route('/').get((req, res)=>{
    Name.find()
    .then(names => res.json(names))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/delete/:id').delete((req, res)=>{
    Name.findByIdAndDelete(req.params.id)
    .then(()=> res.json('user deleted!!!'))
    .catch(err => res.status(400).json('eror ' + err))
});


router.route('/newname').post((req, res)=>{
    var obj = req.body.obj
    const newName = new Name(obj)
    newName.save()
    .then(names => res.json(names))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/updatename/:id').post((req, res)=>{

    Name.findByIdAndUpdate(req.params.id, {$set: req.body.obj})
        .then(()=> res.json('user updates!!!'))
        .catch(err => res.status(400).json('eror ' + err))
    })

module.exports = router;
