exports.show = function (req, res, next) {
    req.getConnection(function(err, connection){
        if (err) 
            return next(err);
        connection.query('SELECT * from customer', [], function(err, results) {
            if (err) return next(err);
            res.render( 'customers', {
                customer : results
            });
            
      });
    });
};

exports.show_events = function (req, res, next) {
    req.getConnection(function(err, connection){
        if (err) 
            return next(err);
        connection.query('SELECT * from events', [], function(err, results) {
            if (err) return next(err);
            res.render( 'events', {
                events : results
            });
            
      });
    });
};

exports.add_customers = function (req, res, next) {
    req.getConnection(function(err, connection){
        if (err){ 
            return next(err);
        }
        
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
                    company : input.company,
                    name : input.name,
                    telephoneNr: input.telephoneNr,
                    email : input.email,
                    products : input.products,
                    invoices : input.invoices,
                    comments: input.comments
            };
                connection.query('insert into customer set ?', data, function(err, results) {
            if (err)
                console.log("Error inserting : %s ", err );
         
                res.redirect('/customers');
        });
    
    });
};

exports.add_events = function (req, res, next) {
    req.getConnection(function(err, connection){
        if (err){ 
            return next(err);
        }
        
        var input = JSON.parse(JSON.stringify(req.body));
        var data = {
                    start_date : input.start_date,
                    end_date : input.end_date,
                    text: input.text
                    
            };
                connection.query('insert into events set ?', data, function(err, results) {
            if (err)
                console.log("Error inserting : %s ", err );
         
                res.redirect('/events');
        });
    
    });
};

exports.get = function(req, res, next){
    var id = req.params.id;
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM customer WHERE id = ?', [id], function(err,rows){
            if(err){
                    console.log("Error Selecting : %s ",err );
            }
            res.render('edit',{page_title:" edit Customers - Node.js", data : rows[0]});      
        }); 
    });
};

exports.get_events = function(req, res, next){
    var id_events = req.params.id;
    req.getConnection(function(err, connection){
        connection.query('SELECT * FROM events WHERE id_events = ?', [id_events], function(err,rows){
            if(err){
                    console.log("Error Selecting : %s ",err );
            }
            res.render('edit_events',{page_title:" edit events - Node.js", data : rows[0]});      
        }); 
    });
};

exports.update = function(req, res, next){

    var data = JSON.parse(JSON.stringify(req.body));
        var id = req.params.id;
        req.getConnection(function(err, connection){
            connection.query('UPDATE customer SET ? WHERE id = ?', [data, id], function(err, rows){
                if (err){
                        console.log("Error Updating : %s ",err );
                }
                res.redirect('/customers');
            });
    });
};

exports.update_events = function(req, res, next){

    var data = JSON.parse(JSON.stringify(req.body));
        var id_events = req.params.id;
        req.getConnection(function(err, connection){
            connection.query('UPDATE events SET ? WHERE id_events = ?', [data, id_events], function(err, rows){
                if (err){
                        console.log("Error Updating : %s ",err );
                }
                res.redirect('/events');
            });
    });
};