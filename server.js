const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors')
const app = express();
const bodyParser= require('body-parser')
const COMMENT_SEARCH_URL = 'https://api.pushshift.io/reddit/comment/search?q=';
//const SEARCH_URL = "https://www.reddit.com/search.json?q=Trump";

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');next(); });
app.set('view engine', 'ejs')

app.get('/*', (req, res) => {
  let query = COMMENT_SEARCH_URL + req.query.q.split(" ").join("%22");
  console.log(query);
  fetch(query)
  .then(data => data.json())
  .then(data => {
    //console.log(data);
    res.status(300).send(data);
  }).catch(err => {
    console.error(err);
    res.status(500).send(renderHTML('Errar'));
  });
});

app.listen(8080, () => console.log('server is running on 8080!'))
