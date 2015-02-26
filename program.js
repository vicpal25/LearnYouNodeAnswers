
// NODE JS TUTORIALS FROM LEARNYOUNODE


var fs = require("fs");


// 1) HELLO WORLD EXAMPLE
console.log("HELLO WORLD");

// 2) BABY STEPS

var result = 0;

for (var i = 2; i < process.argv.length; i++) {
    result = result + Number(process.argv[i]);
}

console.log(result);


// 3) FIRST I/0

var fs = require("fs");
process.argv[2]
fs.readFileSync(process.argv[2])


//**** YOU CAN REPLACE the toString() with utf8 as the second parameter on readFileSync()
var contents = fs.readFileSync(process.argv[2], 'utf8')
var lines = contents.split('\n').length - 1

//vs
// var contents = fs.readFileSync(process.argv[2])
// var lines = contents.toString().split('\n').length - 1
//

// 4)  MY FIRST ASYNC I/O!

var path = process.argv[2];

fs.readFile(path, 'utf8', function(err,data) {
  var lines = data.split('\n');
  console.log(lines.length-1);
});

// 5)  FILTERED LS

var path = require('path');

fs.readdir(process.argv[2], function (err, list) {
  list.forEach(function (filename) {
    if (path.extname(filename) === '.' + process.argv[3]) {
      console.log(filename);
    }
  });
});

// 5)  MAKE IT MODULAR

var mymodule = require('./module.js')

var dir = process.argv[2]
var ext = process.argv[3]

mymodule(dir, ext, function(err, list) {
  if (err) {
   throw err;
  }
  else list.forEach(function (file) {
   console.log(file);
  })
});

  //  6)  HTTP CLIENT

  var http = require('http');
  var url = 'ds.tribune.com/v1/sections/collection/?section_ids=8162&market_id=1&content_profile=24&include_content=true&auth_app_id=b6f83ff4-293c-4ef2-9da0-240ebaa61f70&auth_date=1/27/2015&auth_hash_key=d3b665c70a1f5268cee0c2cf79a0c8608ff84c51';

  http.get(process.argv[2], function(response) {
      response.setEncoding('utf8');
      response.on('error', console.error);
      response.on('data', console.log);
  });

  //  7)  HTTP COLLECT

  var http = require('http')
  var bl = require('bl')

  http.get(process.argv[2], function (response) {
    response.pipe(bl(function (err, data) {
      if (err)
        return console.error(err)
      data = data.toString()
      console.log(data.length)
      console.log(data)
    }))
  })

//  7)  JUGGLING ASYNC

var http = require('http');
var urls = process.argv.slice(2,process.argv.length);
var results = [];
var waiting = 0;

var complete = function(){

    if (!waiting) {
        results.map(function(page){console.log(page)});
    }

}

urls.map(function(url,idx){
    http.get(url,function(res){
        waiting++;
        var alldata = '';
        res.setEncoding('utf8');
        res.on('data',function(data){alldata += data});
        res.on('end', function(){
            results[idx] = alldata;
            waiting--;
            complete();
        });
    });
});


//8)  TIME SERVER

var net = require('net');
var port = process.argv[2];

var server = net.createServer(function createcb(socket) {
    var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth()+1,
    d = date.getDate(),
    h = date.getHours(),
    n = date.getMinutes();
    function addZero(somenum) {
        somenum = somenum.toString()
        if (somenum < 10) {
            somenum = '0' + somenum;
        }
        return somenum;
    }
    m = addZero(m);
    d = addZero(d);
    h = addZero(h);
    n = addZero(n);
    var timestring = y+'-'+m+'-'+d+' '+h+':'+n;
    socket.write(timestring);
    socket.end();
});
server.listen(port);

//9 HTTP FILE SERVER

var http = require('http'),
    fs = require('fs'),
    port = process.argv[2],
    path = process.argv[3];

var server = http.createServer(function(request, response){
    var file = fs.createReadStream(path);
    file.pipe(response);
});

server.listen(port);

//10 HTTP UPPERCASERER\\

var http = require('http');
var map  = require('through2-map');
var port = process.argv[2];

var server = http.createServer(function(req, res) {
    if(req.method !== 'POST')
        return res.end('POST please');

    req.pipe(map(function(chunk) {
        return chunk.toString().toUpperCase();
    })).pipe(res);

});

server.listen(port);

//11 HTTP UPPERCASERER


var http = require('http');
var url = require('url');

var routes = {
  "/api/parsetime": function(parsedUrl) {
    d = new Date(parsedUrl.query.iso);
    return {
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds()
    };
  },
  "/api/unixtime": function(parsedUrl) {
    return {unixtime: (new Date(parsedUrl.query.iso)).getTime()};
  }
}

server = http.createServer(function(request, response) {
  parsedUrl = url.parse(request.url, true);
  resource = routes[parsedUrl.pathname];
  if (resource) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(resource(parsedUrl)));
  }
  else {
    response.writeHead(404);
    response.end();
  }
});
server.listen(process.argv[2]);
