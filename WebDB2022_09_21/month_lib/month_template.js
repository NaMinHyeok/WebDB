var template = {
    HTML:function(title, list, body, control){
        return `
        <!DOCTYPE html>
        <html>  
            <head>
                <title>
                    월별계획 - ${title}
                </title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">월별 계획<a></h1>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        `;
    },
    list:function(calenders){
        var list = '<ul>';
        var i = 0;
        while(i < calenders.length){
            list =  list + `<li><a href="/?id=${calenders[i].id}">${calenders[i].title}</a></li>`;
            i = i + 1;
        }
        list = list+'</ul>';
        return list;
    },
    authorSelect : function(authors, author_id){
        var tag = '';
        var i=0;
        while(i<authors.length){
            var selected='';
            if(authors[i].id===author_id){
                selected = 'selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
            i++;
        }
        return `
            <select name="author">
                ${tag}
            </select>`
    }
}

module.exports = template; 