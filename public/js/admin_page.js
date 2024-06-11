const jwtToken = getCookie("jwt");

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

document.addEventListener("DOMContentLoaded", () => {
    const mainBodySection = document.getElementById("mainBodySection");

    // Функция для получения новостей
    async function fetchNews() {
        try {
            const response = await fetch(window.location.href + "/content", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                mainBodySection.innerHTML = ""; // Очистка основного раздела
                result.data.forEach((news) => {
                    const newsItem = document.createElement("div");
                    newsItem.className = "news-item";

                    const newsTitle = document.createElement("span");
                    newsTitle.textContent = news.title;

                    const deleteButton = document.createElement("button");
                    deleteButton.className = "delete-btn";
                    deleteButton.textContent = "Видалити";
                    deleteButton.onclick = () => deleteNews(news.id);

                    newsItem.appendChild(newsTitle);
                    newsItem.appendChild(deleteButton);
                    mainBodySection.appendChild(newsItem);
                });
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    // Функция для удаления новости
    async function deleteNews(newsId) {
        try {
            const response = await fetch(window.location.href + "/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify({ newsId }),
            });
            const result = await response.json();

            if (result.success) {
                fetchNews(); // Перезагрузить новости после успешного удаления
            }
        } catch (error) {
            console.error("Error deleting news:", error);
        }
    }

    // Загрузка новостей при загрузке страницы
    fetchNews();
});
