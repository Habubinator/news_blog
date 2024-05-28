document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', function() {
        var loginInput = document.getElementById('login').value;
        var passwordInput = document.getElementById('password').value;

        // Виконати запит до сервера для перевірки даних
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        alert('Логін успішний!');
                        // Перенаправлення на іншу сторінку або виконання інших дій
                    } else {
                        alert('Неправильний логін або пароль.');
                    }
                } else {
                    alert('Помилка сервера: ' + xhr.status);
                }
            }
        };
        xhr.send(JSON.stringify({ login: loginInput, password: passwordInput }));
    });
});
