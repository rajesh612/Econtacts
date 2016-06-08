var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require("body-parser");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

app.get('/contactlist',function(req,res){
	console.log("Got the GET Request");
	db.contactlist.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.post('/contactlist',function(req, res){
	console.log(req.body);
	db.contactlist.insert(req.body, function(err, docs){
		res.json(docs);
	});
});

app.delete('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.contactlist.remove({_id:mongojs.ObjectId(id)},function(err,doc){
		res.json(doc);
	});
});

app.get('/contactlist/:id',function(req,res){
	var id = req.params.id;
	console.log("Edit method in Server with id" + id);
	db.contactlist.findOne({_id: mongojs.ObjectId(id)},function(err,doc){
    res.json(doc);
	});
});

app.put('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log("Put Method in Server with Name" + req.body.name);
    db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
    new: true}, function(err,doc){
    	res.json(doc);
    });
});

app.listen(3001);
console.log("Server is running on 3001 port");