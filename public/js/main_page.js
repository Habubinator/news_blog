// Функция для получения значения куки по имени
function getCookie(name) {
    let matches = document.cookie.match(
        new RegExp(
            "(?:^|; )" +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)"
        )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

document.addEventListener("DOMContentLoaded", function () {
    var toggles = document.querySelectorAll(".category-toggle");

    toggles.forEach(function (toggle) {
        toggle.addEventListener("click", function () {
            var subcategoryList = this.nextElementSibling;
            if (
                subcategoryList.style.display === "none" ||
                !subcategoryList.style.display
            ) {
                subcategoryList.style.display = "block";
            } else {
                subcategoryList.style.display = "none";
            }
        });
    });

    // Проверка наличия JWT токена в куки
    const jwtToken = getCookie("jwt");

    if (jwtToken) {
        // Выполнение запроса для проверки токена
        fetch("/auth/verify-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // TODO - отгрузить при успешной авторизации
                } else {
                    // TODO - отгрузить при провальной авторизации
                }
            })
            .catch((error) => {
                console.error("Ошибка проверки токена:", error);
            });
    } else {
        alert("Пожалуйста, войдите в систему");
    }
});
