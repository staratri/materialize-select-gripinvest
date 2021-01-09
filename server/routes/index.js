var express = require('express');
var router = express.Router();


const DEFAULT_ENTITIES = [
  'apple',
  'papaya',
  'guavava',
  'mango',
  'grapes',
  'cherry',
  'litchy'
]

/* GET home page. */
router.get('/entities', function(req, res, next) {
  const { search } = req.query
  const filteredItems = search ? DEFAULT_ENTITIES.filter(item => item.includes(search)) : []
  return res.json({
    items: filteredItems
  })
});

module.exports = router;
