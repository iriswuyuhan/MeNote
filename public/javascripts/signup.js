var url = "/users/signup";

function signup() {
    //TODO 还要判断用户名和密码的长度,还要进行正则的筛选
    var username = document.getElementById("username").value;
    if (username == null) {
        alert("You haven't set your user name!");
    }
    else {
        var passwrd1 = document.getElementById("passwrd1").value;

        if (passwrd1 == null) {
            alert("You haven't set your password!");
        }
        else {
            var passwrd2 = document.getElementById("passwrd2").value;

            if (passwrd1 != passwrd2) {
                alert("The second password doesn't match the first one!");
            }
            else {
                localStorage.setItem('user', username);
                var userInfo = {username: username, password: passwrd1};
                $.ajax({
                    type: "POST",
                    url: url,
                    data: userInfo,
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data == "1") {
                            //TODO 这里应该写一个定时跳转界面
                            window.location.href = "/login";
                        }
                        else {
                            alert("Your name already exists!Please enter another one!");
                        }
                    }
                });
            }
        }
    }
}