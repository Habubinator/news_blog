document.addEventListener("DOMContentLoaded", function () {
    var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", async function () {
        var loginInput = document.getElementById("login").value;
        var passwordInput = document.getElementById("password").value;

        // Виконати запит до сервера для перевірки даних
        const response = await fetch("./login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                login: loginInput,
                password: passwordInput,
            }),
        });
        if (response.status === 200) {
            alert("Логін успішний!");
            // TODO - Save jwt token to cookies
            // Then Reditect
            window.location.href = "/";
        } else if (response.status === 400) {
            alert("Неправильний логін або пароль.");
        } else if (response.status === 404) {
            alert("Юзеру з даним логіном не існує");
        } else {
            alert("Помилка сервера: " + response.status);
        }
    });
});
