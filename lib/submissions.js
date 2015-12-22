var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var $fh = require('fh-mbaas-api');

var router = new express.Router();
router.use(cors());
router.use(bodyParser());


// GET REST endpoint - query params may or may not be populated
router.get('/', function(req, res) {
  var params = {};

  $fh.forms.getSubmissions(params, function (err, submissions) {
    if (err){
      return res.status(500).json(err);
    }
    return res.json(submissions);
  });
  
});


module.exports = router;
