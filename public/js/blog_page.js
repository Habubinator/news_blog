const { response } = require("express")

document.addEventListener("DOMContentLoaded", function () {
    fetch(`/news/blog_page`) // /1
        .then(response => response.json())
        .fetch("/blog_page/news_content")
        .then(data => {
            pullContent(data)
        })
    .catch(error => console.error('Ошибка:', error));
});

function pullContent(data){
    const newsContent = data.page_content;
    document.getElementById('news_content').content = newsContent;
}