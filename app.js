//'use strict';
var express = require("express")
var exphbs = require("express-handlebars"),

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

app.get('/init', function(req, res){
    dbOptions.event.insert({ 
        text:"My test event A", 
        start_date: new Date(2013,8,1),
        end_date:   new Date(2013,8,5)
    });
    dbOptions.event.insert({ 
        text:"One more test event", 
        start_date: new Date(2013,8,3),
        end_date:   new Date(2013,8,8),
        color: "#DD8616"
    });

    /*... skipping similar code for other test events...*/

    res.send("Test events were added to the database")
});


app.get('/data', function(req, res){
    dbOptions.event.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});

//scheduler.config.xml_date="%Y-%m-%d %H:%i";

        //var dp = new dataProcessor("/data");
        //dp.init(scheduler);
        //dp.setTransactionMode("POST", false);

  app.post('/data', function(req, res){
    var data = req.body;

    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;
  //remove properties which we do not want to save in DB
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    //output confirmation response
    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

    //run db operation
    if (mode == "updated")
        dbOptions.event.updateById( sid, data, update_response);
    else if (mode == "inserted")
        dbOptions.event.insert(data, update_response);
    else if (mode == "deleted")
        dbOptions.event.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});

app.get('/customers', customersMethods.show);

app.get('/add_customers', function(req, res){
  res.render("add_customers",{data:customersMethods})
});

app.post('/customers/add_customers', customersMethods.add_customers);

app.get('/customer/edit/:id', customersMethods.get);
app.post('/customers/update/:id', customersMethods.update);

app.get('/',function(req,res){

  res.render("home")
});



var port = process.env.PORT || 3000;

var server = app.listen(port, function(){

  console.log("server is running on " + server.address().address + ":" +server.address().port)

});