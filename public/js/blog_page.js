const { response } = require("express")

document.addEventListener("DOMContentLoaded", function () {
    fetch('/news/blog_page')
        .then(response => response.json())
        .then(data => {
            console.log('Получены данные для страницы:', data);

            return fetch(`/news/blog_page/news_content`)
            .then(response => response.json())
            .then(data => {
                console.log('Получены данные для содержимого:', data);
                if (data.success) {
                    pullContent(data.page_content);
                } else {
                    console.error('Ошибка при получении данных:', data.message);
                }
            })
        })
        .catch(error => console.error('Ошибка:', error));
});

function pullContent(newsContent) {
    console.log('Получено содержимое:', newsContent);

    const contentContainer = document.getElementById('news_content');
    contentContainer.innerHTML = newsContent;
}
