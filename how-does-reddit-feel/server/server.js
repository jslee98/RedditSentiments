const express = require('express');
const fetch = require('node-fetch');
const app = express();
const bodyParser= require('body-parser')
const COMMENT_SEARCH_URL = 'https://api.pushshift.io/reddit/comment/search?size=400&fields=body&q=';
const SUBMISSION_SEARCH_URL = 'https://api.pushshift.io/reddit/submission/search?size=400&q=';
const TOP_SUBMISSIONS_URL = 'https://www.reddit.com/search.json?sort=top&type=link&t=day&q=';
const port = process.env.PORT || 8080;
//const SEARCH_URL = "https://www.reddit.com/search.json?q=Trump";

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');next(); });
app.set('view engine', 'ejs');

app.get('/search/*', (req, res) => {
  //console.log(req.query);
  let search_query = COMMENT_SEARCH_URL + req.query.q.split(" ").join("%22");
  if(req.query.type == "Posts") {
    search_query = SUBMISSION_SEARCH_URL + req.query.q.split(" ").join("%22");
  }
  fetch(search_query)
  .then(data => data.json())
  .then(result => {
    //console.log(data);

    res.status(200).send(result);
  }).catch(err => {
    console.error(err);
    res.status(500).send(renderHTML('Errar'));
  });
});

app.get('/top/*', (req, res) => {
  console.log(req.query);
  let query = TOP_SUBMISSIONS_URL + req.query.q.split(" ").join("%22");
  fetch(query)
  .then(data => data.json())
  .then(data => {
    //console.log(data);
    res.status(300).send([data.data.children[0], data.data.children[1]]);
  }).catch(err => {
    console.error(err);
    res.status(500).send(renderHTML('Errar'));
  });
});

app.listen(port, () => console.log('server is running on 8080!'))
