const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
    const url = req.url;
    const method = req.method;

    if(url==='/'){
        res.write('<html>');
        res.write('<head><title>node</title></head>');
        res.write('<body><form action="/message" method="POST"><input type = "text" name="message"><button>submit</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    //console.log(req.url, req.method, req.headers);

    if(url ==='/message' && method ==='POST'){
        const body = [];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end',()=>{
            const parseBody=Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            console.log(message);
            fs.writeFile('message.txt', message, err=>{
                res.statusCode=302;
                res.setHeader('Location',"/");
                return res.end();
            });
        });
    }
    else{
        res.setHeader('Content-Type','text/html');
        res.write('<html>');
        res.write('<head><title>node</title></head>');
        res.write('<body><p>Node Responded Sucessfully</p></body>');
        res.write('</html>');
        res.end();
    }   
});

server.listen(3000); 
