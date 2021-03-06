var express = require('express')
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var xml = require('xml');
var mainHtml = 'Default html';
var connectionpool = mysql.createPool({
	host	: 'localhost',
	user	: 'root',
	password : 'nd888nd7',
	database : 'language_rescue_database'
});
app.use(bodyParser.json());
fs.readFile('../FrontEnd/index.html', function(err, html){
	if (err) {
		console.error('COULDN\'T OPEN FILE', err);
		res.send({
			result: 'error',
			err: err.code
		});
		mainHtml = 'THERE WAS AN ERROR RETRIEVING THE FILE';
	}
	else
	{
		mainHtml = html;
	}
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/index.html'));
});

app.get('/doubleit', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleIt/index.html'));
});

app.get('/doubleitrush', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleItRush/index.html'));
});

app.get('/doubleiteasy', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleEasy/index.html'));
});

app.get('/friendsinabox', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/index.html'));
});

app.get('/band', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/index.html'));
});

app.get('/hannah', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/hannah/index.html'));
});

app.get('/videos/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/hannah/videos/'+req.params.filename));
});

app.get('/BAND/MAINFILES/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/MAINFILES/'+req.params.filename));
});

app.get('/BAND/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/'+req.params.filename));
});

app.get('/BAND/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/MAINFILES/'+req.params.filename));
});

app.get('/selectall/:table', function(req,res){
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		} 
		else 
		{
			connection.query('SELECT * FROM '+req.params.table+' ORDER BY id', req.params.id, function(err, rows, fields) 
			{		
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length: rows.length
				});
				connection.release();
			});
		}
	});
});
app.get('/selectwhere/:table/:field/:field_value', function(req,res){
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM ' + req.params.table+' WHERE ' + req.params.field+' = ' + req.params.field_value, function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length: rows.length
				});
				connection.release();
			});
		}
	});
});
app.get('/check/:table/:field/:field_value', function(req,res) {
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM ' + req.params.table+' WHERE ' + req.params.field+' = \'' + req.params.field_value + '\'', function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				else
				{
					var exists = true;
					if (rows.length < 1)
					{
						exists = false;
					}
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length:rows.length,
					exists: exists
				});
				connection.release();
			});
		}	
	});
});
app.get('/login/:username/:password', function(req,res) {
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM users WHERE username = \''+req.params.username+'\'', function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				else
				{
					var valid_username = false;
					var valid_password = false;
					if (rows.length > 0)
					{
						valid_username = true;
						if (rows[0].password == req.params.password)
						{
							valid_password = true;
						}
					}
				}
				res.send({
					result: 'success',
					error: '',
					valid_username : valid_username,
					valid_password : valid_password,
					user: rows[0]
				});
				connection.release();
			});
		}
	});
});		
app.post('/insert/:table', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		var data = {};
		if (req.params.table == 'users')
		{
			
			data = {
				username : input.username,
				password : input.password,
				email : input.email,
				contributions : input.contributions,
				abuse_strikes : input.abuse_strikes
				
			};
		}
		else if (req.params.table == 'languages')
		{
			data = {
				language_name : input.language_name
			};
		}
		else if (req.params.table == 'entries')
		{
			data = {
				language_id : input.language_id,
				term : input.term,
				definition : input.definition,
				part_of_speech : input.part_of_speech,
				first_contributed_user : input.first_contributed_user,
				last_contributed_user: input.last_contributed_user
			};
		}
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			if (req.params.table == 'entries'){
				connection.query('UPDATE users SET contributions = contributions+1 WHERE username = \'' + input.first_contributed_user + '\'', function (err, result) {
					if (err) throw err;
				//res.send('User contribution count has increased.');
			});
			}
			connection.query('INSERT INTO ' + req.params.table + ' SET ?', data, function (err, result) {
				if (err) throw err;
				res.send('User added to the database with ID: ' + result.insertID);
			});
		}
	});
});

app.post('/update/:entry', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE users SET contributions = contributions+1 WHERE username = \'' + input.last_contributed_user + '\'', function (err, result) {
				if (err) throw err;
			});
			
			connection.query('UPDATE entries SET definition = \'' + input.definition + '\', last_contributed_user = \'' + input.last_contributed_user + '\' WHERE term = \'' + input.term + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
			});
		}
	});
});

app.post('/flag/:entry', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE users JOIN entries ON entries.last_contributed_user = users.username SET users.abuse_strikes = users.abuse_strikes+1 WHERE entries.term = \'' + input.term + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
			});
		}
	});
});

app.post('/increment/:game', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE games SET game_count = game_count+1 WHERE game_title = \'' + req.params.game + '\'', function (err, result) {
				if (err) throw err;
				else {
					connection.query('SELECT game_count FROM games WHERE game_title = \''+req.params.game+'\'', function(err, rows, fields) {
						if (err)
						{
							console.log("ERROR!!!");
						}

						var numViews = rows[0].game_count;
						var xmlObj = [{ views: numViews }];
						res.set('Content-Type', 'text/xml');
						res.send(xml(xmlObj));
						console.log("ROWS[0]: " + rows[0]);
						console.log("ROWS[0].game_count: " + rows[0].game_count);
						//res.send(
						//rows[0].game_count
						//);
					});
				};

			
				process.stdout.write("responded postively: ");
			});
		}
	});
});

app.get('/:folder/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/' + req.params.folder + '/' + req.params.filename));	
});

app.get('/GAMES/FriendsInABox/Avatars/:folder/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Avatars/' + req.params.folder + '/' + req.params.filename));	
});

app.get('/GAMES/FriendsInABox/Avatars/:folder1/:folder2/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Avatars/' + req.params.folder1 + '/' + req.params.folder2 + '/' + req.params.filename));	
});

app.get('/GAMES/FriendsInABox/Backgrounds/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Backgrounds/' + req.params.filename));	
});

app.post('/inbound', function(request, response) {
    response.type('text/xml');
    response.send('<Response><Say>Hello there! Thanks for calling Paul\'s Server.</Say></Response>');
});

app.post('/incomingtext', function(request, response) {
    response.type('text/xml');
    response.send('<Response><h1>Hello there! Thanks for texting Paul\'s Server.</h1></Response>');
});

app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});
app.listen(80);
console.log('Paul and Mitch\'s Rest API listening on port 80');
