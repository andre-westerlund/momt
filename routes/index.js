var express = require('express');
var router = express.Router();
var auth = require('../middleware/auth');
var User = require("../models/UserModel");
var Momt = require("../models/NumberModel");

var multer  = require('multer');
var upload = multer({ dest: 'uploads/'})
var csv = require('fast-csv');
var fs = require('fs');
var middleware = require('../middleware/numberImport');

/* GET home page. */
router.get('/', auth.isAuthenticated, async function(req, res, next) {
  var momt = await Momt.find().populate('submittedBy').exec();
  res.render('index', { title: 'Index', momt: momt, info: req.flash() });
});

/* GET Users page. */
router.get('/user', auth.isAuthenticated, async function(req, res, next) {
  var users = await User.find({ _id: {$ne: req.user._id}});
  res.render('user', { title: 'Users', users: users });
});

router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Login' });
});

router.post('/upload', upload.single('file'),async function(req,res,next){
  const file = req.file
  var info;
  if (!file) {
    const error = new Error('Please upload a file');
    req.flash('msg', error.toString());
    req.flash('status', "danger");
    res.status(400);
    return res.redirect('/');
  }
  const nums = [];
  try{
    await csv.parseFile(req.file.path, {headers: false})
    .on("data", async function(data){
      nums.push(data);     
    }).on("end", async function(){
      info = await middleware.import(nums, req.user, new Date());
      fs.unlinkSync(req.file.path);
      var message = info.message;
      var errorNum = info.errorNum;
      if(errorNum == nums.length){
        res.status(400);
        req.flash('msg', `Please ensure CSV file follows correct format. Total Numbers: ${nums.length} = Total Errors: ${errorNum}`);
        req.flash('status', "danger");
      }else{
        res.status(200);
        req.flash('msg', message);
        req.flash('status', "success");
      }
  
      res.redirect('/');
    });
  }catch(err){
    res.status(500).send(err.toString());
  }
});


module.exports = router;
