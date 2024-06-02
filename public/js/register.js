document.addEventListener("DOMContentLoaded", function () {
    var submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", async function () {
        var emailInput = document.getElementById("email").value;
        var loginInput = document.getElementById("login").value;
        var passwordInput = document.getElementById("password").value;
        var passwordRepInput = document.getElementById("password_rep").value;

        // Виконати запит до сервера для перевірки даних
        const response = await fetch("./register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                email: emailInput,
                login: loginInput,
                password: passwordInput,
                passwordRep: passwordRepInput,
            }),
        });
        
        if (response.status === 200) {
            alert("Реєстрація успішна!");
            // TODO - Save jwt token to cookies
            // Then Reditect
            window.location.href = "/";
        } else if (response.status === 405) {
            alert("Заповніть всі поля.");
        } else if (response.status === 401) {
            alert("Паролі не співпадають.");
        } else if (response.status === 402) {
            alert("Е-мейл повинен мати @.");
        } else if (response.status === 403) {
            alert("Користувач з таким емейлом вже існує у системі.");
        } else {
            alert("Помилка сервера: " + response.status);
        }
    });
});
