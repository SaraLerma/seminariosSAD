var fs = require('fs');
var Q = require('q');
var rolodex = {
  a: "We know this name",
};

function retrieve(file, name) {
	//para que no esté vacio en ningún momento y no devuelva un error
	return name;
}

//crea o abre el fichero en caso de existir
var rolodexFile = fs.open('My rolodexFile File', 'w', function(err, file){
	if(err) throw err;
});


function processEntry(name) {
	//Promesa para el name
	if (rolodex[name]) {
		//console.log(name);
		var deferred = Q.defer();
		deferred.resolve(retrieve("", rolodex[name]));
		return deferred.promise;
	} 
	//Promesa para el file y el name
	else {
		var deferred = Q.defer();
		deferred.resolve(retrieve(rolodexFile, name));
		return deferred.promise;
    }
 }

function test() {
	testNames.forEach(function (element){
		console.log('processing', element);
		
		//con esta promesa nos aseguramos de entrar en processEntry y saber si ha ido bien
		processEntry(element).then(function(res){
			console.log('processed', element);
		})
	})
}

var testNames = ['a', 'b', 'c'];

test();
