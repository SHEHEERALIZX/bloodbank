var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Donor = require('../models/donor');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  if(req.session.user){
    req
    res.render('index',{user:req.session.user});
  } else {
    res.render('index');
  }
});

/* GET Donors page. */
router.get('/donors',async function(req, res, next) {
  
  const data = Donor.find().lean()
  data.exec((err,donors)=>{
    if(err){
      console.log(err);
    } else {
      console.log(donors);
      return res.render('pages/donors',{donors,user:req.session.user});
    }
  })
  // return res.render('pages/donors',{user:req.session.user});
});


/* GET Login page. */
router.get('/login', function(req, res, next) {
  res.render('pages/login',{user:req.session.user});
});

/* GET Login page. */
router.post('/login', function(req, res, next) {
  console.log(req.body);
  const { phoneNumber, password } = req.body;
    try {
      if(phoneNumber && password){
        User.findOne({phoneNumber: Number(phoneNumber)}, (err, user) => {
          if(err){
            console.log(err);
            res.status(500).send('Error logging in please try again.');
          } else {
            if(!user){
              res.status(401).send('Phone Number or password incorrect');
            } else {
              if(user.password === password){
                const userdata = {
                  name: user.name,
                  phoneNumber: user.phoneNumber
                }
                req.session.user = userdata;
                res.redirect('/');
              } else {
                res.status(401).send('Phone Number or password incorrect');
              }
            }
          }
        });
      } else {
        res.status(500).send('All fields are required.');
      }
    } catch (error) {
      console.log(error.message);
    }
   
});






/* GET Signup page. */
router.get('/signup', function(req, res, next) {
  res.render('pages/signup');
});

/* Post Signup page. */
router.post('/signup', function(req, res, next) {
  console.log(req.body);
  const { name, phoneNumber, password } = req.body;
  if(name && phoneNumber && password ){
    const user = new User({
      name,
      phoneNumber,
      password

    });

    user.save((err, result) => {
      if(err){
        console.log(err);
        // res.status(500).send('Error registering new user please try again.');
        res.redirect('/signup')

      } else {
        const user = {
          name: result.name,
          phoneNumber: result.phoneNumber

        }
        req.session.user = user;
        res.redirect('/');
      }
    });
  } else {
    res.status(500).send('All fields are required.');
  }
});

router.get('/add-donor', function(req, res, next) {
  res.render('pages/add-donor',{user:req.session.user});
});

router.post('/add-donor', function(req, res, next) {
  console.log(req.body);
  const { name, phoneNumber, location, district ,state, pincode , bloodGroup } = req.body;
  if(name && phoneNumber && bloodGroup && location){
    const donor = new Donor({
      name,
      phoneNumber:Number(phoneNumber),
      bloodGroup,
      location,
      district,
      state,
      pincode,


    });
    donor.save((err, result) => {
      if(err){
        console.log(err);
        res.status(500).send('Error registering new user please try again.');
        // res.redirect('/add-donor')
          
      } else {
        const donor = {
          name: result.name,
          phoneNumber: result.phoneNumber,
          bloodGroup: result.bloodGroup,
          location: result.location
        }
        req.session.donor = donor;
        res.redirect('/donors');
      }
    });
  } else {
    res.status(500).send('All fields are required.');
  }
});



/* GET Logout page. */
router.get('/logout', function(req, res, next) {
  if(req.session.user){
    req.session.destroy();
  }
  res.redirect('/');
});




module.exports = router;
