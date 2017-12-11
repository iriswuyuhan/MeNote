var username = localStorage.getItem('user');
var currentContent = "";

function getNote(file) {
    var url = "/users/getNote";
    var path = {username: username, fileName: files[file]};

    $.ajax({
        type: "POST",
        url: url,
        data: path,
        dataType: "json",
        async: false,
        success: function (data) {
            var curLi = document.getElementById("no" + file);
            setactive(curLi);

            var content = data.content;

            //TODO 这里应该做一些判断(我也不知道当时为啥写了这个TODO，想好了再说吧)
            var title = document.getElementById("title_space");
            title.value = files[file];

            var textArea = document.getElementById("text");
            textArea.value = content;
            currentContent = content;
        }
    });
}

function saveNote() {
    //TODO 这里应该改为正则表达式
    var fileName = document.getElementById("title_space").value;

    if (fileName == null) {
        alert("You haven't named the note!");
    }
    else {
        //检查重名
        var active = $("#scro1").find(".active");
        var id = active.eq(0).attr('id');
        var pathfile = "";
        var type = "0";//是否改名
        var content = document.getElementById("text").value;
        if ("add" != id) {
            id = id.substring(2);
            pathfile = files[id];
            if (fileName != files[id]) {
                type = "1";//要改名
            } else if (content == currentContent) {
                //内容没有改动
                alert("There is no any changes!");
                return;
            }
        }
        else {
            pathfile = fileName;
        }

        var duplicate = false;
        //检查重名
        for (var index = 0; index < files.length; index++) {
            if (index != id && fileName == files[index]) {
                alert("Note name should be unique!");
                duplicate = true;
                break;
            }
        }
        if (duplicate) {
            return;
        }

        var url = "/users/saveNote";
        var path = username;
        var note = {path: path, pathfile: pathfile, headline: fileName, content: content, type: type};
        $.ajax({
            type: "POST",
            url: url,
            data: note,
            dataType: "json",
            async: true,
            success: function (data) {
                if (data == "1") {
                    alert("Successfully saved!");
                    if ("add" != id) {
                        files[id] = fileName;
                        active.eq(0).text(fileName);
                    }
                    else {
                        appendIndexItem(fileName);
                        files[i] = fileName;
                        i++;
                        location.reload();
                    }
                }
                else {
                    alert("Not saved!Please try again after a proper period!");
                }
            }
        });
    }
}

//设置导航为active状态的方法
function setactive(type) {
    $("#scro1").find("li").each(function () {
        $(this).removeClass("active");
    });
    $(type).addClass("active");
}

function clear() {
    currentContent = "";
    
}