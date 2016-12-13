var http = require('http');
var express = require('express');
var manejadorDeEventos = {};
var manejadorDeBase = {};
var mu = require('mu2')
var request = require('request');
var _ = require('underscore');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');
var baseMongo = null;

mu.root = __dirname + '/templates';



var noticias = [];

var titleHackaton = "Hackaton";

var noticia = {};

noticia.tituloNoticia = "tituloNoticiatest";
noticia.resumenNoticia = "Resumen testing loco";
noticia.link = "unlinkbienpiolah.com";
noticia.pathImage = "rickyfort.jpg";

noticias.push(noticia)



mongoose.connect('mongodb://localhost/admin')

var url = 'mongodb://localhost:27017/admin';





var app = express();
var id = 0;

var posts = {};
var visitas = 0;

manejadorDeEventos.getUltimo = function(res){
  res.end(JSON.stringify(posts[posts.length-1]));
};

manejadorDeEventos.getIndex = function(res){
  //var idReq = req.params.id;
  mu.clearCache();
  var stream = mu.compileAndRender('index.html', {'noticias': noticias, 'titleHackaton': titleHackaton});
  stream.pipe(res);
};












var errorPath = "error404.html";


app.get('/', function(req,res){
  manejadorDeEventos.getIndex(res);
});
app.get('/index.html', function (req, res) {
  manejadorDeEventos.getIndex(res);
});
app.get('/index', function (req, res) {
  manejadorDeEventos.getIndex(res);
});


app.delete('/posts/:id', function (req, res) {
  res.end(JSON.stringify(posts[id]));
});

app.get('/catastrofe.html',function(req, res){
  res.sendFile(__dirname + "/templates/catastrofe.html");
})


app.get('/cargar_catastrofe', function (req, res) {

   nuevoDocumento = {
      resumen:req.query.noticia,
      titulo:req.query.titulo,
      link:req.query.link,
      imagen:req.query.imagen
   };

   baseMongo.insert(nuevoDocumento);

   res.sendFile( __dirname + "/index.html" );
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

MongoClient.connect(url, function (err, db) {
  if (err) {

    console.log('Unable to connect to the mongoDB server. Error:', err);

  } else {

    server.listen(process.env.PORT || 3000);
    console.log('Connection established to', url);
    baseMongo = db;

  }
});
