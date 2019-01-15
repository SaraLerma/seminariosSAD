var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var fecha = new Date(2000,1,1,0,0,0,0); 
var conectados = [];
var dictSockets = {};

io.on('connection', function(socket){

	// Notificacion de usuario conectado
	console.log('Usuario conectado');
	socket.broadcast.emit('chat message', "Usuario conectado");
	
	var usuario = null;
	conectados.push(usuario);
	
	socket.on('disconnect', function(){
		console.log('Usuario desconectado (' + usuario + ')');
		
		// Actualizamos la lista de conectados
		var indice = conectados.findIndex(function(str) {
			return (str == usuario);
		});		
		conectados.splice(indice, 1);
				
		// Actualizamos diccionario de sockets
		delete dictSockets[usuario];
		
		// Notificacion de usuario desconectado
		if (usuario == null) socket.broadcast.emit('chat message', "Usuario desconectado");
		else socket.broadcast.emit('chat message', usuario + " se ha desconectado");
	});
	
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		
		// Establecer usuario
		if (msg.startsWith("/usuario")) { 
			nuevousuario = msg.substring("/usuario".length).trim();
			
			// Actualizar lista conectados
			var indice = conectados.findIndex(function(str) {
				return (str == usuario);
			});
			conectados.splice(indice, 1, nuevousuario);
			
			// Si se cambia de usuario, se borra el anterior nombre
			delete dictSockets[usuario]; 
			dictSockets[nuevousuario] = socket;			
			usuario = nuevousuario;
			
			// Enviar mensaje
			socket.emit("chat message", "Nuevo usuario: \"" + usuario + "\"");
		}
		// Mostrar usuarios conectados
		else if (msg == "/conectados") { 
			socket.emit("conectados", conectados);
		}
		//Mensajes privados
		else if (msg.startsWith("/msg")) { 
			var str = msg.substring("/msg".length).trim();
			var destinatario = str.substring(0, str.indexOf(" "));
			var msg = str.substring(str.indexOf(" ") + 1);			
			if (destinatario in dictSockets) {
				socket.emit("chat message", "Mensaje enviado");
				dictSockets[destinatario].emit("chat message", "Mensaje de " + usuario + ": " + msg);
			} 
			else {socket.emit("chat message", "Usuario no encontrado");}
		} 
		// Mensajes con nombre de usuario
		else { 
		// Sin nombre de usuario
			if (usuario == null) socket.broadcast.emit('chat message', "Anonimo: " + msg); 
		// Con nombre de usuario
			else socket.broadcast.emit('chat message', usuario + ": " + msg); 
		}
	});
	socket.on('writing', function(msg) {fecha = new Date();});
	//Intervalo de tiempo
	setInterval(function() { var escribiendo = ((new Date()) - fecha) <= 1000;io.emit('writing', escribiendo);}, 1000);
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
