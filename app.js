var SIDs = [];

function login(json){
    let data = json.login;
    if(data.username && data.password && data.requestTimestamp && data.publicKey){

        let name = data.publicKey.split('.');

        var logins = [
            ['test', 'test01'],
            ['test', 'test02'],
            ['test', 'test03']
        ];

        for(let i of logins){
            if(data.username == i[0] && data.password == i[1]){

                let SID = 'f4b26c4820c9270cde61ce8447754fc1';
                SIDs.push([data.publicKey, SID]);

                return [{ 
                    login: { 
                        sessionId: '##login_sessionId##-' + SID,
                        firstName: name[0],
                        lastName: name[1] 
                    } 
                }, 200];
            }
        }

        return [{ 
             login: {
                errors: {
                    password: "API_USER_NOT_EXISTS"
                }
            } 
        }, 401];

    } else {
        return [{ 
             login: {
                errors: {
                    password: "API_REQUIRED_PARAMETER"
                }
            } 
        }, 400];
    }
}
function getParkingLog(json){
    var data = json.getParkingLog;
    if(data.carPlateNumber && data.areaId && data.sessionId && data.requestTimestamp && data.publicKey){

        let SID = data.sessionId.split('-');
        SID = SID[1];
        for(let i of SIDs){
            if(data.publicKey == i[0] && SID == i[1]){

                return [{ 
                    getParkingLog: { 
                        status: 'OK'
                    } 
                }, 200];
            }
        }
        return [{ 
            getParkingLog: {
                errors: {
                    password: "API_CHECK_KEY"
                }
            } 
        }, 400]; 
    } else {
        return [{ 
            getParkingLog: {
                errors: {
                    password: "API_REQUIRED_PARAMETER"
                }
            } 
        }, 400];
    }
}

const Hapi=require('hapi');

const server=Hapi.server({
    host:'localhost',
    port:8000
});

server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {

        return 'Use POST';
    }
});
server.route({
    method:'POST',
    path:'/',
    handler:function(request,h) {
        var json = request.payload;

        if(json.login){ 
            let data = login(json);
            return h.response( data[0] ).code(data[1]);
        } else if(json.getParkingLog){
            let data = getParkingLog(json);
            return h.response( data[0] ).code(data[1]);;
        }

        return 'err';
    }
});

// Start the server
const start =  async function() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();


var ob1 = {
    login: {
        username: "test",
        password: "test01",
        requestTimestamp: "20171030070703",
        publicKey: "Jan.Kowalski"
    }
}

var ob2 = {
    getParkingLog: {
        carPlateNumber: "WR 432",
        areaId: "420",
        sessionId: "##login_sessionId##-f4b26c4820c9270cde61ce8447754fc1",
        requestTimestamp: "20171030070703",
        publicKey: "Jan.Kowalski"
    }
}
var request = require('request');
request.post({
    url: 'http://localhost:8000/',
     json: ob1
     }, function(error, response, body){
        console.log(body);
});
request.post({
    url: 'http://localhost:8000/',
     json: ob2
     }, function(error, response, body){
        console.log(body);
});
