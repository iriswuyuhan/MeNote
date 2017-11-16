var username = localStorage.getItem('user');

function getNote(fileName) {
    var url = "/users/getNote";
    var path = {username: username, fileName: fileName};

    $.ajax({
        type: "POST",
        url: url,
        data: path,
        dataType: "json",
        async: false,
        success: function (data) {
            var content = data.content;

            //TODO 这里应该做一些判断
            var title = document.getElementById("title_space");
            title.value = fileName;

            var textArea = document.getElementById("text");
            textArea.value = content;
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
        var url = "/users/saveNote";
        var path = username + "/" + fileName;
        var content = document.getElementById("text").value;
        var note = {path: path, content: content};

        $.ajax({
            type: "POST",
            url: url,
            data: note,
            dataType: "json",
            async: true,
            success: function (data) {

            }
        });
    }
}