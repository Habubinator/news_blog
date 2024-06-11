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

// Функция для удаления куки по имени
function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999;";
}

// Функция для удаления JWT куки и обновления страницы
function deleteJwtAndRefresh() {
    deleteCookie("jwt");
    window.location.reload();
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
                    const button = document.getElementById("login");
                    button.value = "Вийти";
                    button.onclick = () => {
                        deleteJwtAndRefresh();
                    };
                } else {
                    // TODO - отгрузить при провальной авторизации
                    const button = document.getElementById("login");
                    button.onclick = () => {
                        window.location.href = "/auth/login";
                    };
                }
            })
            .catch((error) => {
                console.error("Ошибка проверки токена:", error);
            });
    } else {
        const button = document.getElementById("login");
        button.onclick = () => {
            window.location.href = "/auth/login";
        };
    }

    const newsContainer = document.getElementById("news");

    // Функция для получения новостей по тегу
    async function fetchNews(tagId = null) {
        try {
            const url = tagId ? `/api/contentByTagId` : `/api/content`;
            const options = tagId
                ? {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json;charset=utf-8",
                      },
                      body: JSON.stringify({ tagId: tagId }),
                  }
                : {};

            const response = await fetch(url, options);
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                newsContainer.innerHTML = ""; // Очистка контейнера новостей
                result.data.forEach((news) => {
                    const newsBox = document.createElement("div");
                    newsBox.className = "news-box";

                    const newsImage = document.createElement("img");
                    newsImage.src = news.main_image_href; // Используем URL изображения из новости
                    newsImage.alt = "News Image";
                    newsImage.width = 350;
                    newsImage.height = 350;

                    const underDivContainer = document.createElement("div");
                    underDivContainer.className = "underDivContainer";

                    const newsTitle = document.createElement("h3");
                    newsTitle.className = "news-title";
                    newsTitle.textContent = news.title;

                    // Добавляем ссылку на новость
                    newsTitle.addEventListener("click", () => {
                        window.location.href = `/news/${news.id}`;
                    });

                    const newsDescription = document.createElement("p");
                    newsDescription.className = "news-description";
                    newsDescription.textContent = news.small_desc;

                    underDivContainer.appendChild(newsTitle);
                    underDivContainer.appendChild(newsDescription);
                    newsBox.appendChild(newsImage);
                    newsBox.appendChild(underDivContainer);
                    newsContainer.appendChild(newsBox);
                });
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    // Загрузка новостей при загрузке страницы
    fetchNews();

    fetch("/api/tags")
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const tags = data.data;
                tags.sort((a, b) => b.news_count - a.news_count);

                const topTags = tags.slice(0, 3);
                const tagsDiv = document.getElementById("tags");
                tagsDiv.innerHTML = ""; // Clear existing tags

                topTags.forEach((tag) => {
                    const tagDiv = document.createElement("div");
                    tagDiv.innerHTML = `<p>${tag.tag_name} <em id="newsEm">${tag.news_count}</em></p>`;
                    tagDiv.addEventListener("click", () => {
                        fetchNews(tag.tag_id);
                    });
                    tagsDiv.appendChild(tagDiv);
                });
            }
        })
        .catch((error) => console.error("Error fetching tags:", error));
});
