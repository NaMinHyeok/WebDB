var http = require('http');
var fs = require('fs'); // node.js 의 file system 모듈을 객체화해서 fs 변수에 저장
var app = http.createServer(function(request,response){
    // 여기에 클라이언트의 요청을 받아서 URL분류
    // URL에 따른 controller에 해당하는 로직을 작성
    var url = request.url;
    if(request.url == '/') {        // '/' 는 ROOT 디렉토리를 뜻한다 ROOT 디렉토리에 있다면
        url = '/test.html';
    }
    if(request.url == '/gachon') {     // /gachon 이라는 url로 접속될때
        url = '/test1.html';            // gachon.ac.kr이라는 url이 보이게 만든다
    }
    if(request.url == '/favicon.ico') {     // 없는 URL이 들어오면
        return response.writeHead(404);
    }
    response.writeHead(200);
    console.log(__dirname + url);           // 웹 브라우저가 요청한 파일의 경로를 콘솔에 출력
    response.end(fs.readFileSync(__dirname + url));         // __dirname 은 홈디렉터리의 주소 // fs.readFileSync 웹 브라우저가 요청한 파일을 읽어서 응답
                                                          // 따라서 홈디렉터리의 주소 + url 의 파일을 읽어서 응답한다. 
    // response.end('egoing : ' + url);
});
app.listen(3000);

// root 디렉토리로 접속되면 test.html을 실행하고
// /gachon 이라는 URL로 접속이 되면 gachon대학교 링크를 보여주는 페이지가 나타나도록 코드바꾸기