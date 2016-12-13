var http = require('http');
var express = require('express');
var manejadorDeEventos = {};
var mu = require('mu2')
var request = require('request');
var _ = require('underscore');
/*var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');
*/



var noticias = [];

var titleHackaton = "Hackaton";

var noticia = {};

noticia.tituloNoticia = "tituloNoticiatest";
noticia.resumenNoticia = "Resumen testing loco";
noticia.link = "unlinkbienpiolah.com";
noticia.pathImage = "rickyfort.jpg";

noticias.push(noticia)



//mongoose.connect('mongodb://localhost/admin')
/*
var url = 'mongodb://localhost:27017/admin';


MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // Get the documents collection
    db.createCollection('usuarios');


    var collection = db.collection('usuarios');

    //collection.insert({name: 'menem'});

    collection.find({name: 'menem'}).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length) {
        console.log('Found:', result);
        valor = result;
      } else {
        console.log('No document(s) found with defined "find" criteria!');
      }
      //Close connection
      db.close();
    });
  }
});
*/


var app = express();
var id = 0;

var posts = {};
var visitas = 0;

manejadorDeEventos.getUltimo = function(res){
  res.end(JSON.stringify(posts[posts.length-1]));
};

manejadorDeEventos.getIndex = function(res){
  res.sendFile( __dirname + "/index.html" );
};

mu.root = __dirname + '/templates';



var errorPath = "error404.html";

var getIndex = function (req, res) {

  //var idReq = req.params.id;
  mu.clearCache();
  var stream = mu.compileAndRender('index.html', {'noticias': noticias, 'titleHackaton': titleHackaton});
  stream.pipe(res);

}


app.get('/posts/new', function (req, res) {
  manejadorDeEventos.getUltimo(res);
});

app.get('/', function(req,res){
  getIndex(req, res);
});
app.get('/index.html', function (req, res) {
   getIndex(req, res);
});
app.get('/index', function (req, res) {
   getIndex(req, res);
});


app.delete('/posts/:id', function (req, res) {
  res.end(JSON.stringify(posts[id]));
});

app.get('/catastrofe.html',function(req, res){
  res.sendFile(__dirname + "/templates/catastrofe.html");
})


app.get('/cargar_catastrofe', function (req, res) {

   datos = {
      noticia:req.query.noticia,
      titulo:req.query.titulo
   };
   id++;

   posts[id] = datos;
   res.sendFile( __dirname + "/public/index.html" );
})


app.get('/posts', function (req, res) {
  res.end(JSON.stringify(posts));
})




















app.use('/assets/css', express.static(__dirname + '/assets/css'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/assets/js', express.static(__dirname + '/assets/js'));


var server = app.listen(process.env.PORT || 3000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})


server.listen(process.env.PORT || 3000);
