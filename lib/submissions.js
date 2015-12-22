var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var $fh = require('fh-mbaas-api');
var _ = require('underscore');

var router = new express.Router();
router.use(cors());
router.use(bodyParser());


// GET REST endpoint - query params may or may not be populated
router.get('/', function(req, res) {
  var params = {};

  $fh.forms.getSubmissions(params, function (err, apiResponse) {
    if (err){
      return res.status(500).json(err);
    }
    var subs = apiResponse.submissions.submissions;
    subs = _.map(subs, function(sub){
      // process each individual submission object, making it more user friendly to consume
      
      // Remove the original form definition from the submission - we likely won't need this, and makes the response bulkier
      delete sub.formSubmittedAgainst;
      
      // create a convenient map of submitted field names and their values
      var simpleSubmission = {};
      _.each(sub.formFields, function(field){
        var key = field.fieldId._id;
        simpleSubmission[key] = {
          // NB  this logic assumes no multi-value fields
          value : _.first(field.fieldValues),
          type : field.fieldId.type,
          name : field.fieldId.name
        };
      });
      sub.simpleSubmission = simpleSubmission;
      return sub;
    });
    return res.json(subs);
  });
  
});


module.exports = router;
