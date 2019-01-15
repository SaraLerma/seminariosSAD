var mgdb = require('mongodb');
var assert = require('assert');

var mongoclient = mgdb.MongoClient;

var url='mongodb://userTest1:pw123456@ds251284.mlab.com:51284/carrito-sad';

mongoclient.connect(url,function (err,db) {
 	assert.equal(err,null);
 	console.log('conectado');

	/*db.createCollection("documents", function(err, res) {
    	if (err) throw err;
    	console.log("Collection created!");
  	});*/
    insertDocuments(db,function() {
    	if (err) throw err;
    	console.log('success with insertion!');
    	db.close();
    });
});

 var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('products');
  // Insert some documents
  collection.insertMany([
    {cod : 1,desc:'palos',stock:0}, {cod : 2,desc:'hierros',stock:10}, {cod : 3,desc:'muelles',stock:5}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 products into the collection");
    callback(result);
  });
}


