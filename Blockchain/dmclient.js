var dm = require ('./dm_remote.js');

var HOST = '127.0.0.1';
var PORT_REQ = 9001;

//node dmclient.js PORT_REQ "login" usuario contraseña
//node dmclient.js PORT_REQ "add public message" usuario idTema mensaje
//node dmclient.js PORT_REQ "add private message" usrEmisor usrDestino mensaje
//node dmclient.js PORT_REQ "get public message list" idTema 
//node dmclient.js PORT_REQ "get private message list" usrEmisor usrDestino 
//node dmclient.js PORT_REQ "add user" usuario contraseña
//node dmclient.js PORT_REQ "add subject" tema 
//node dmclient.js PORT_REQ "get subject list"  
//node dmclient.js PORT_REQ "get user list"  
//argumentos desde la consola
var args = process.argv.slice(2);

var addressport = HOST + ":" + PORT_REQ;
var msg = "";
var param = {};

//tu sabes dependiendo del ID lo que hace falta, por ejemplo "login" para login tu sabes que hace falta un usuario y contraseña 
//pues haces un switch y dependiendo de la accion que sea pues miras el numero de argumentos, compruebas que lo que te mandan está bien etc, por ejemplo,
// "add private message" tiene emisor destino y mensaje entonces en total son 5 argumentos (o los que sean) si son menos puedes poner el mensaje 
//"Para añadir un mensaje privado necesitas urlemisor urldestino y mensaje" lo unico que deberían de poner al menos la acción bien
 switch(args[1]) {
    case 'add user':
        if (args.length < 4){
            console.log("USO: node dmclient.js PORT_REQ 'add user' usuario contraseña");
        }
        break;
    case 'add subject':
        if (args.length < 3){
            console.log("USO: node dmclient.js PORT_REQ 'add subject' idTema");
        }
        break;
    case 'get subject list':
        if (args.length < 2){
            console.log("USO: node dmclient.js PORT_REQ 'get subject list'");
        }
        break;
    case 'get user list':
        if (args.length < 2){
            console.log("USO: node dmclient.js PORT_REQ 'get user list'");
        }
        break;
    case 'login':
        if (args.length < 4){
            console.log("USO: node dmclient.js PORT_REQ 'login' usuario contraseña");
        }
        break;
    case 'add private message':
        if (args.length < 5){
            console.log("USO: node dmclient.js PORT_REQ 'add private message' usrEmisor usrDestino mensaje");
        }
        break;
    case 'get private message list':
        if (args.length < 4){
            console.log("USO: node dmclient.js PORT_REQ 'get private message list' usrEmisor usrDestino");
            }
        break; 
    case 'add public message':
        if (args.length < 5){
            console.log("USO: node dmclient.js PORT_REQ 'add public message' usuario idTema mensaje");
        }
        break;
    case 'get public message list':
        if (args.length < 3){
            console.log("USO: node dmclient.js PORT_REQ 'get public message list' idTema");
        }
        break;
    default: console.log ("Error: funcion no reconocida");
 }


if(process.argv.length > 2 && args[0].includes(":")){
    addressport = args[0].split(":");
    HOST = addressport[0];
    PORT_REQ = addressport[1];
    msg = args[1];
    param = args.slice(2, args.length); 
}else{
    PORT_REQ = args[0];
    msg = args[1];
    param = args.slice(2, args.length);
}
dm.Start(HOST, PORT_REQ, function () {
    switch (msg) {
        // TODO complete list of commands
        case 'add user':
            dm.addUser(param[0],param[1],function(ml){  
                if(ml){
                    console.error("El usuario " + param[0] + " ya existe en el sistema.");
                }else{
                    console.log("El usuario " + param[0] + " ha sido añadido correctamente.");
                }
                dm.close();
            });
            break;
        case 'add subject':
            dm.addSubject(param[0],function(id){
                if(id === -1){
                    console.error("El tema " + param[0] + " ya existe en el sistema.");
                }else{
                    console.log("El tema " + param[0] + " ha sido añadido correctamente.");
                    console.log("El identificador del tema añadido es : " + id);
                }
                dm.close();
            });
            break;
        case 'get subject list':
            dm.getSubjectList (function (ml) {
                if(ml==undefined){
                    console.log("No hay temas");
                }else{
                    console.log("Los temas son los siguientes: " + ml);
                };
                dm.close();
            });
            break;
        case 'get user list':
            dm.getUserList(function (ml){
                if(ml==undefined){
                    console.log("No hay usuarios");
                }else{
                    console.log("Los usuarios son los siguientes: " + ml);
                }
                dm.close();
            });
            break;
        case 'login':
            dm.login(param[0], param[1], function(res){
                if(res){
                    console.error("El usuario " + param[0] + " ha sido logeado exitosamente.");
                }else{
                    console.log("El usuario " + param[0] + " NO ha sido logeado exitosamente.");
                }
                dm.close();
            });
            break;
        case 'add private message':
            var message = {from: param[0], to: param[1], msg: param[2]};
            dm.addPrivateMessage(message, function(res){
                dm.close();
            });
            break;
        case 'get private message list':
            dm.getPrivateMessageList(param[0], param[1], function(res){
                if(res==undefined){
                    console.log("No hay mensajes privados entre los usuarios " + param[0] + " y " + param[1]);
                }else{
                    console.log("Los mensajes privados entre los usuarios " + param[0] + " y " + param[1] + "son los siguientes: \n");
                    var listMsg = JSON.parse(res);
                    for(var msg in listMsg) {
                        var mensaje = listMsg[msg];
                        console.log("Mensaje de " + mensaje.from +": " + mensaje.msg);
                    }
                }
                dm.close();
            });
            break;
        case 'add public message':
            var message = {from: param[0], to: param[1], msg: param[2]};
            dm.addPublicMessage(message, function(res){
                dm.close();
            });
            break;
        case 'get public message list':
            dm.getPublicMessageList(param[0], function(res){
                if(res==undefined){
                    console.log("No hay mensajes en el tema " + param[0]);
                }else{
                    console.log("Los mensajes del tema " + param[0] + " son los siguientes: \n" );
                    var listMsg = JSON.parse(res);
                    for(var msg in listMsg) {
                        var mensaje = listMsg[msg];
                        console.log("Mensaje de " + mensaje.from +": " + mensaje.msg);
                    }
                    
                }
                dm.close();
            });
            break;
        default: console.log ("Error en dmclient");
	}
});

