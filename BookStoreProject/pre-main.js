const express = require('express') ;
const app = express();
app.set('views',__dirname+'/views');
app.set('view_engine','ejs');
var db = require('./lib/db.js');
// var auth = require('./lib/authentication');
var etc = require('./lib/etc');
// var book = require('./lib/book');


// app.get('/',function(request,response){
//     book.home(request,response);
// });

// app.post('/',function(request,response){
//     book.home(request,response);
// });

app.get('/calendar',function(request,response){
    etc.calendarHome(request,response);
});

app.get('/calendar/create',function(request,response){
    etc.calendarCreate(request,response);
});

app.post('/calendar/create_process',function(request,response){
    etc.calendarCreate_process(request,response);
});

app.get('/calendar/list',function(request,response){
    etc.calendarList(request,response);
});

app.get('/calendar/update/:planId',function(request,response){
    etc.calendarUpdate(request,response);
});

app.post('/calendar/update_process/:planId',function(request,response){
    etc.calendarUpdate_process(request,response);
});

app.get('/calendar/delete_process/:planId',function(request,response){
    etc.calendarDelete_process(request,response);
});

app.listen(3000,() => 
    console.log('Example app listening on port 3000!'));