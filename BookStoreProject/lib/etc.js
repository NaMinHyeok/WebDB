var db = require('./db');
var qs = require('querystring');

module.exports =  {
    calendarHome : function(request, response){
        db.query(`SELECT * FROM calendar`, function(error, result){
            if(error){
                throw error;
            }
            tmplogin = 'Y'
            var context = {doc : `./calendar/calendar.ejs`,
                            loggined:tmplogin,
                            id: 'admin',
                            results:result
                            };
            request.app.render('index',context,function(err,html){
            response.end(html);
            });
        });
    },
    calendarCreate : function(request,response){
        var titleofcreate = 'Create';
        var context = { doc : `./calendar/calendarCreate.ejs`,
                        title : '',
                        description : '',
                        kindOfDoc : 'C', 
                        loggined : 'Y',
                        id : 'admin'                   
                        };
        request.app.render('index',context,function(err,html){
        response.end(html);
        });
    },
    calendarCreate_process : function(request,response){
        var body ='';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var cal = qs.parse(body);
            db.query(`
                INSERT INTO calendar (title, description, created, author_id)
                    VALUES(?,?,NOW(),2)`,
                [cal.title, cal.description], function(error,result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/calendar`});
                    response.end();
                }
            );
        });
    },
    calendarList : function(request,response){
        db.query(`SELECT * FROM calendar `,
                function(error,result){
                    if(error){
                        throw error;
                    }
                    tmplogin='Y';
                    var context = { doc : `./calendar/calendarList.ejs`,
                    loggined : 'Y',
                    id : 'admin',
                    results : result                
                    };
                    
                    request.app.render('index',context,function(err,html){
                    response.end(html);
                });
        });
    },
    calendarUpdate : function(request,response){
        var titleofcreate = 'Update';
        var planId = request.params.planId;
        db.query(`SELECT * FROM calendar WHERE id = ${planId}`,
                function(error,result){
                    if(error){
                        throw error;
                    }
                    var context = { doc : `./calendar/calendarCreate.ejs`,
                    title : result[0].title,
                    description : result[0].description,
                    pId : planId,
                    kindOfDoc : 'U',
                    loggined : 'Y',
                    id : 'admin',      
                    };
                    request.app.render('index',context,function(err,html){
                    response.end(html);
                });
        });
    },
    calendarUpdate_process : function(request,response){
        var body ='';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var plan = qs.parse(body);
            planId = request.params.planId;
            db.query(`
                UPDATE calendar SET title=?, description=?, author_id=? WHERE id=?`,
                [plan.title, plan.description, 2, planId], function(error,result){
                    response.writeHead(302, {Location: `/calendar`});
                    response.end();
                }
            );
        });
    },
    calendarDelete_process : function(request, response){
        var planId = request.params.planId;
        db.query('DELETE FROM calendar WHERE id = ?', [planId],function(error,reuslt){
            if(error){
                throw error
            }
            response.writeHead(302,{Location : '/calendar'});
            response.end();
        })
    }
}