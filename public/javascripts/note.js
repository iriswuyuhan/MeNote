var url = "/users/getNote";

function getNote(fileName) {
    var username = localStorage.getItem('user');
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