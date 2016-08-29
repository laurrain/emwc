//'use strict';
var express = require("express")
var exphbs = require("express-handlebars");
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra'),       //File System - for file manipulation

    mysql = require('mysql'), 
    myConnection = require('express-myconnection'),
    bodyParser = require('body-parser'),
    customersMethods = require('./routes/customers'),
    session = require('express-session');

  
   app = express();

   dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '42926238',
      port: 3306,
      bind:'event',
      database: 'emwc'
};


app.engine("handlebars", exphbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/static", express.static("views"));
app.use(express.static("public"));
app.use("/static", express.static("."))
//app.use("/static", express.static("routes"))

//setup middleware
app.use(myConnection(mysql, dbOptions, 'single'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'lau lo',
  resave: true,
  saveUninitialized: false,
  cookie : {maxAge : 30*60000}
}))

 


app.get('/events', customersMethods.show_events);


app.get('/customers', customersMethods.show);

app.get('/add_customers', function(req, res){
  res.render("add_customers",{data:customersMethods})
});

app.get('/add_events', function(req, res){
  res.render("add_events",{data:customersMethods})
});

app.post('/add_customers', customersMethods.add_customers);

app.post('/add_events', customersMethods.add_events);

app.post('/customers/update/:id', customersMethods.add_customers);

app.get('/customer/edit/:id', customersMethods.get);

app.get('/edit_events/:id', customersMethods.get_events)
app.post('/update_events/:id', customersMethods.update_events);

/*app.route('/upload')
app.post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });
    });*/

app.get('/file', function(req, res){
  res.render('file')
})


app.get('/',function(req,res){

  res.render("home")
});



var port = process.env.PORT || 3000;

var server = app.listen(port, function(){

  console.log("server is running on " + server.address().address + ":" +server.address().port)

});