var db = require('./db.js');
var template = require('./month_template.js');
var qs=require('querystring');
var url=require('url');

module.exports =  {
    home : function(response){
        db.query(`SELECT * FROM calender`, function(error, calenders){
            var title = '연간 계획'
            var description = '월별 계획을 생성해보자'
            var list = template.list(calenders);
            var html = template.HTML(title,list,
                `<h2>${title}</h2><p>${description}</p>`,
                `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
    },

    page : function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM calender`, function(error, calenders){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM calender WHERE id=?`,[queryData.id],function(error2,calender){
            if(error2){
                throw error2;
            }
            var title = calender[0].title;
            var description = calender[0].description;
            var list = template.list(calenders);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                    </form>`
                );
                response.writeHead(200);
                response.end(html);
    });
});
    },
    create : function(request,response){
        db.query(`SELECT * FROM calender`, function(error, calenders) {
            var title = 'Create';
            var list = template.list(calenders);
            var html = template.HTML(title, list,
                `
                <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
        });
    },
    create_process : function(request,response){
        var body ='';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            db.query(`
                INSERT INTO calender (title, description, created, author_id)
                    VALUES(?,?,NOW(),?)`,
                [post.title, post.description, 1], function(error,result){
                    if(error){
                        throw error;
                    }
                    response.writeHead(302, {Location: `/?id=${result.insertId}`});
                    response.end();
                }
            );
        });
    },
    update : function(request,response){
        var _url = request.url;
        var queryData = url.parse(_url, true).query;
        db.query('SELECT * FROM calender', function(error, calenders){
            if(error){
                throw error;
            }
            db.query(`SELECT * FROM calender WHERE id=?`,[queryData.id], function(error2, calender){
                if(error2){
                    throw error2;
                }
                var list=template.list(calenders);
                var html=template.HTML(calender[0].title,list,
                        `   <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${calender[0].id}">
                            <p><input type="text" name="title" placeholder="title" value="${calender[0].title}"></p>
                            <p><textarea name="description" placeholder="description">${calender[0].description}</textarea></p>
                            <p> <input type="submit"> </p>
                        </form>     `,
                        `<a href="/create">create</a> <a href="/update?id=${calender[0].id}">update</a>`
                        );
                    response.writeHead(200);
                    response.end(html);
            });
        });
    },
    update_process : function(request,response){
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            db.query('UPDATE calender SET title=?, description=?, author_id=1 WHERE id=?',
                [post.title, post.description, post.id], function(error, result){
                response.writeHead(302, {Location: `/?id=${post.id}`});
                response.end();
            });
        });
    },
    delete_process : function(request,response){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            db.query('DELETE FROM calender WHERE id = ?',[post.id],function(error, result){
                if(error){
                    throw error;
                }
                response.writeHead(302, {Location: '/'});
                response.end();
            });
        });
    }
}