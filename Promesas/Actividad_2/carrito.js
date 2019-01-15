var mgdb = require("mongodb");
var assert = require("assert");
var Q = require('q');

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://userTest1:pw123456@ds251284.mlab.com:51284/carrito-sad';

//Conectar con la base de datos
mongoclient.connect(url, function(err, db) {
    assert.equal(err, null);
    console.log("conectado");

    //PRUEBAS para ver si el carrito funciona
    //añadirCarrito ("que quieres añadir", "cuanto")
    anyadirProducto(db, 'hierros', 1);
    anyadirProducto(db, 'palos', 2);
    setTimeout(function() {
      quitarProductoDelCarro('hierros', 1);
    }, 1000);
    
});

var carrito = [];

//FUNCIONES DE BUSQUEDA Y DE ACTUALIZACION
function buscarProducto(db, desc, cantidad) {
	
    var resultado = db.collection("products").find({ desc: desc }).toArray(function(err, listadoProductos) {
        //console.log('RESULTADO: ', listadoProductos, listadoProductos[0]);
        var res = listadoProductos[0];
        if (res["stock"] >= cantidad) {
            return [Q.fbind(actualizarProducto), res["desc"]];
        } else {
            //throw new Error();
            return (err);
        }
    });
};

function buscarIndiceArray(array, atribut, producto) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][atribut] === producto) {
            return i;
        }
    }
    return -1;
}

function actualizarProducto(db, desc, cantidad) {
    carrito[desc] = cantidad;
};


//FUNCION DE AÑADIR ELEMENTO AL CARRITO - CON PROMESAS
anyadirProducto = function(db, producto, cantidad) {
	
	//PbuscarProducto es la funcion buscarProducto pero en forma de promesa
    var PbuscarProducto = Q.fbind(buscarProducto);
    var PactualizarProdcuto = Q.fbind(actualizarProducto);

	//Se registra una llamada a la funcion asincrona PbuscarProducto
	//indicando funciones a realizar en cuanto termine (*)
    var p1 = PbuscarProducto(db, producto, cantidad);
    
    p1	// (*) then es la funcion a realizar si la promesa termina bien
        .then(function(p) { 
			if (producto != "palos"){
				console.log("El producto: " + producto + ", está en stock.");
				console.log("Del producto: " + producto + ", se ha añadido al carrito la cantidad de: " + cantidad + ".\n"); 
			}
			db.close(); 
			return p[0](db, p[1], cantidad); 
		})
        // (*) fail es la funcion a realizar si la promesa termina mal
        .fail(function(err) { 
			if (producto == "palos"){
				console.log("El producto: " + producto + ", no está en stock\n"); 
			}
			db.close();
		});
};

//FUNCION DE QUITAR ELEMENTO DEL CARRITO
quitarProductoDelCarro = function(producto, cantidad) {
    var flag_existe = true;
    carrito.forEach(function(atributo) {
        if (atributo.desc == producto) {
            flag_existe = true;
            atributo.cantidad = atributo.cantidad - cantidad;
            if (atributo.cantidad <= 0) {
                var indiceProducto = buscarIndiceArray(carrito, "desc", producto);
                if (indiceProducto > -1) {
                    carrito.splice(indiceProducto, 1);
                }
            }
        }
    });
    console.log("Se ha quitado del carrito el producto: " + producto + ", la cantidad eliminada: " + cantidad + "."); 
    if (!flag_existe) {
        console.log(
            "no se ha encontrado un producto que se llame: " + producto
        );
    }
};







