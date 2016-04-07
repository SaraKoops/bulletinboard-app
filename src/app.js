
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var fs = require('fs');
var app = express ();

var conString = "postgres://sara:123@localhost/sara"; // connectionString
// pg.connect(conString, function (err, client, done) {

	app.set('views', 'src/views');
	app.set('view engine', 'jade');

app.use(express.static('public')); // elk statische file dat je gebruikt leest ie uit de folder public.
app.use(bodyParser.urlencoded({extended: true}));


// home page with forms to enter message

app.get('/', function (request, response) {

	response.render("index");
});


// send message to database

app.post('/writemessage', function (request, response) {

	
	var titleMessage = request.body.titleMessage;
	var bodyMessage = request.body.bodyMessage;

	var message = {};
	message.titleMessage = titleMessage
	message.bodyMessage = bodyMessage

	console.log(message);

	pg.connect(conString, function (err, client, done){
		client.query('INSERT INTO bulletinboard (title, body) VALUES ($1, $2)', [titleMessage, bodyMessage], function (err){
			if (err) {
				throw err;
			}

			done();
			pg.end();

			response.redirect('/listmessage'); // cause nodejs is async place it in the same 
		});
	});

});

// overview of messages

app.get('/listmessage', function (request, response){

	pg.connect(conString, function (err, client, done) {

		client.query("SELECT * FROM bulletinboard", function (err, result) {

			
			if (err) {
				console.log(err);
				done();
				return
			}

			// console.log(result.rows);

			var lijst = result.rows;

			console.log(lijst);

			done();

			response.render('prikboard', {pipo: lijst});
		});
	});

})




var server = app.listen(3000, function (){
	console.log('Example app listening on port: ' + server.address().port);
});