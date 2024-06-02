const { response } = require("express")

document.addEventListener("DOMContentLoaded", function () {
    const id = 1; // for test
    fetch(`/news/blog_page/${id}`)
        .then(response => response.json())
        .then(data => {
            const newsContent = data.page_content; 
            document.getElementById('description-text').textContent = newsContent;
        })
        .catch(error => console.error('Ошибка:', error));
});