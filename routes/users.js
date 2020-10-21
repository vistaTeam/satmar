const router = require('express').Router();
let bodyParser = require('body-parser')
let User = require('../models/users.model');
const path = require('path')
const fs = require('fs');
const { log } = require('console');


router.route('/finduserbyid/:id').get((req, res)=>{
    User.findById(req.params.id)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/').get((req, res)=>{
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/findUser/:email').get((req, res, next)=>{
    User.find({email: req.params.email.toLowerCase()})
    .then((data)=> res.json(data),console.log('Log in good!'))
    .catch(err => res.status(400).json('eror ' + err))
})

router.route('/newuser').post((req, res)=>{
    var obj = {"name": req.body.values.name,
               "email": req.body.values.email.toLowerCase(),
               "password": req.body.values.password}

    const newUser = new User(obj)
    newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Eror' + err))
});

router.route('/deleteuser/:id').delete((req, res)=>{
    User.findByIdAndDelete(req.params.id)
    .then(()=> res.json('user deleted!!!'))
    .catch(err => res.status(400).json('eror ' + err))
});


router.route('/changename/:id').post((req, res)=>{
    console.log(req.params.id);
    User.findById(req.params.id)
    .then( user => {
        console.log(user);
        user.name = req.body.values.name
        user.save()
        .then(user=> res.json(user), console.log(user))
        .catch(err => res.status(400).json('eror ' + err))
    })
    .catch(err => res.status(400).json('eror ' + err))
})



router.route('/changeemail/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.email = req.body.values.email.toLowerCase()
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).json('eror ' + err))
    })

    .catch(err => res.status(400).json('eror ' + err))
})


router.route('/changepassword/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.password = req.body.values.newPassword
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).json('eror ' + err))
    })

    .catch(err => res.status(400).json('eror ' + err))
})


router.route('/rememberuser/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.rememberAccount = req.body.values.remember
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).json('eror ' + err))
    })

    .catch(err => res.status(400).json('eror ' + err))
})


router.route('/lastlogindate/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.lastLoginDate = req.body.today
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).console.log(err))
    })

    .catch(err => res.status(400).json('eror ' + err))
})

router.route('/lastlogintime/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.lastLoginTime = req.body.time
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).console.log(err))
    })

    .catch(err => res.status(400).json('eror ' + err))
})

router.route('/logged/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.logged = req.body.logged
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).console.log(err))
    })
    .catch(err => res.status(400).json('eror ' + err))
})


router.route('/changeStatus/:id').post((req, res)=>{
    User.findById(req.params.id)
    .then( user => {
        user.administrator = req.body.user.administrator;
        user.allowedToEdit = req.body.user.allowedToEdit;
        user.allowedToDownload = req.body.user.allowedToDownload;
        user.entryPermit = req.body.user.entryPermit
        user.save()
        .then(user=> res.json(user))
        .catch(err => res.status(400).console.log(err))
    })

    .catch(err => res.status(400).json('eror ' + err))
});


module.exports = router;
