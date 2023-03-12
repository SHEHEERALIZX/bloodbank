var express = require('express');
var router = express.Router();
const User = require('../models/users');
const Donor = require('../models/donor');


const isLoggedin = (req, res, next) => {
  if(req.session.user){
    next();
  } else {
    res.redirect('/login');
  }
}




/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  if(req.session.user){
    res.render('index',{user:req.session.user});
  } else {
    res.render('index');
  }
});



/* GET Donors page. */
router.get('/donors',async function(req, res, next) {
  const filterArray = req.query.blood;
  console.log(filterArray)

  if(filterArray===undefined){
    const data = Donor.find().lean()
    data.exec((err,donors)=>{
      if(err){
        console.log(err);
      } else {
        return res.render('pages/donors',{donors,user:req.session.user});
      }
    })

  } else {
    const data = Donor.find({bloodGroup:{$in:filterArray}}).lean()
    data.exec((err,donors)=>{
      if(err){
        console.log(err);
      } else {
        console.log(donors)
        return res.render('pages/donors',{donors,user:req.session.user});
      }
    })
  }




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
        return res.status(500).send('Error registering new user please try again.');
       
      }
       const user = {
          name: result.name,
          phoneNumber: result.phoneNumber

        }
        const donor = new Donor({
          name,
          phoneNumber,
          bloodGroup: "",
          location : "",
          district : "",
          state : "",
          pincode : "",
          isAvailable : false,
          isVisible : false,

        })
        console.log(donor)
        donor.save((err, result1) => {
          if(err){
            console.log(err);
            return res.status(500).send('Error registering new user please try again.');
          }
          user.donor_id = result1._id;
          req.session.user = user;
          return  res.redirect('/');

        });
  
    });
  } else {
    res.status(500).send('All fields are required.');
  }
});



router.get('/add-donor', isLoggedin, function(req, res, next) {
  const districts = ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"];
  console.log(req.session.user)
   const searchuser = Donor.findOne({phoneNumber:req.session.user.phoneNumber}).lean()
    searchuser.exec((err,donor)=>{
      if(err){
        console.log(err);
      } else {
        console.log(donor);
        if(donor){
          return res.render('pages/add-donor',{user:req.session.user,donor:donor,districts});
        } else {
          return res.render('pages/add-donor',{user:req.session.user,districts:districts});
        }
      }
    })
});

router.post('/add-donor', function(req, res, next) {
  console.log(req.body);
  const { name, phoneNumber, location, district ,state, pincode , bloodGroup ,status } = req.body;
  if(name && phoneNumber && bloodGroup && location){
    Donor.updateOne(
      { phoneNumber: phoneNumber }, // Filter by phoneNumber
      {
        name: name,
        phoneNumber: Number(phoneNumber),
        bloodGroup: bloodGroup,
        location: location,
        district: district,
        state: state,
        pincode: pincode,
        isAvailable: Boolean(status),
      }, // Update the document
      function (err) {
        if (err) {
          console.log(err);
          return res.status(500).send('Error updating donor, please try again.');
        }
        return res.redirect('/donors');
      }
    );
  } else {
    return res.status(500).send('All fields are required.');
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
