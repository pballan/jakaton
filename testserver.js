var http = require('http');
var express = require('express');
var mysql = require('mysql');
var manejadorDeEventos = {};
var mu = require('mu2')
var request = require('request');
var _ = require('underscore');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoose = require('mongoose');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mysql123',
  database : 'AlarmaSys'
});
var valor;

//mongoose.connect('mongodb://localhost/admin')

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



var app = express();
var id = 0;

var server = http.createServer();
var posts = {};
var visitas = 0;

manejadorDeEventos.getUltimo = function(res){
  res.end(JSON.stringify(posts[posts.length-1]));
};

manejadorDeEventos.getIndex = function(res){
  res.sendFile( __dirname + "/public/index.html" );
};

connection.connect(function(err){
  if(!err) {
      console.log(" OK ----> BASE DE DATOS CONECTADA");
  } else {
      console.log(" ERROR ----> ERROR EN CONECCION A BASE DE DATOS");
  }
});


app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));

var errorPath = "error404.html";

app.get('/', function (req, res) {
  manejadorDeEventos.getIndex(res);
});

app.get('/posts/new', function (req, res) {
  manejadorDeEventos.getUltimo(res);
});

app.get('/posts/:id', function (req, res) {

  //var idReq = req.params.id;
  mu.clearCache();

  var stream = mu.compileAndRender('public/views/noticia.html', {'lalala': valor});
  stream.pipe(res);


});

app.delete('/posts/:id', function (req, res) {

  res.end(JSON.stringify(posts[id]));

});

app.get('/nuevopost.html',function(req, res){
  res.sendFile(__dirname + "/public/views/nuevopost.html");
})

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/public/testapi.html" );
});


app.get("/consulta",function(req,res){
  /*connection.query('SELECT * from Cliente LIMIT 2', function(err, rows, fields) {
    connection.end();
    if (!err)
      res.end(JSON.stringify(rows));
    else
      console.log('Error while performing Query.');
  });*/
  request.get('http://localhost:8080/menem',function(error, response, body){
    if (!error && response.statusCode === 200) {
      console.log(body);
      var data = JSON.parse(body);
      console.log(data);
    }
    response.end(data);
  })

});



app.get('/recibir_datos', function (req, res) {

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


















var server = app.listen(process.env.PORT || 3000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})


server.listen(process.env.PORT || 3000);
