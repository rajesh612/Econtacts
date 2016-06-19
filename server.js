var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require("body-parser");
var multer = require('multer'); 
var _ = require('underscore');

app.use(express.static(__dirname+"/uploads"));
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+ '.jpg');
  }
});

var upload = multer({ storage : storage}).single('userPhoto');

app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.get('/contactlist',function(req,res){
	console.log("Got the GET Request");
	db.contactlist.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.delete('/contactlist/:id', function(req, res){
	console.log("You are in delete server js");
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
	console.log(req.body);
    db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number, filename: req.body.filename}
},
    new: true}, function(err,docs){
    	res.json(docs);
    });
});

app.post('/upload',function(req,res){
	console.log("You are in upload server js");
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log("==body=======");
		console.log(req.body);
        console.log("==file=======");		
		console.log(req.file);
		console.log("====================");
		if( typeof req.file === "undefined" && typeof req.body != "undefined"){	
         var imgdata ={"filename": "default.jpg"}; //set default pic from uploads folder
		 var target = _.extend(req.body, imgdata);
          console.log("Concatenated Json" );
		  console.log(target);
		 db.contactlist.insert(target, function(err, docs){
		 console.log(" default file is uploaded");
		 res.redirect('http://localhost:3001');
	     });
		} else{			
			var imgdata ={"filename": req.file.filename};
		    var target = _.extend(req.body, imgdata);
			console.log("Concatenated Json" );
		    console.log(target);
         db.contactlist.insert(target, function(err, docs){
		console.log("file is uploaded");
		res.redirect('http://localhost:3001');
	    });
		}
		
    });

});

app.listen(3001);
console.log("Server is running on 3001 port");