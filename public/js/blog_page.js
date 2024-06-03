
document.addEventListener("DOMContentLoaded", function () {

   fetch(`/news/blog_page/news_content`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Вызываем pullContent с данными:', data.page_content);
                        pullContent(data.page_content); 
                    } else {
                        console.error('Error:', data.message);
                    }
                })
        .catch(error => console.error('Error:', error)); 
});

function pullContent(newsContent) {

    const contentContainer = document.getElementById('news_content');
    contentContainer.innerHTML = newsContent;
}

