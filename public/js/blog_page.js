
document.addEventListener("DOMContentLoaded", function () {

   fetch(`/news/blog_page/news_content`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {

                        const newsContent = data;
                        
                        pullContent(newsContent); 
                    } else {
                        console.error('Error:', data.message);
                    }
                })
        .catch(error => console.error('Error:', error)); 


    const userId = 1; //placeholder
    const news_id = 3; //placeholder
    var submitButton = document.getElementById('submit');

    submitButton.addEventListener("click", async function () {

        var commentForm = document.getElementById('commForm').value;

        // Виконати запит до сервера для перевірки даних
        const response = await fetch("blog_page/submit_comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                userId: userId,
                comment_content: commentForm,
                news_id: news_id
            }),
        });

        if (response.status == 400){
            alert("Ви вже залишали коментар.")
        }
    });
});

function pullContent(newsContent) {

    const titleContainer = document.getElementById('news-title');
    titleContainer.innerHTML = newsContent.responseContent.title;

    const authorContainer = document.getElementById('news_author');
    authorContainer.innerHTML = "Author: " + newsContent.responseContent.author.username;

    const mainImageContainer = document.getElementById('main_image');
    const imgElement = document.createElement('img');
    imgElement.src = newsContent.responseContent.mainImage.image_href;

    mainImageContainer.appendChild(imgElement);
    
    const contentContainer = document.getElementById('news_content');
    contentContainer.innerHTML = newsContent.responseContent.news_content;

    const tagsContainer = document.getElementById('tags-container'); 
    console.log(tagsContainer);

    newsContent.responseContent.tags.forEach(tag_name => {
        
        const tagsElement = document.createElement('div');
        tagsElement.innerHTML = tag_name.tag_name;

        tagsElement.classList.add("tag")

        tagsContainer.appendChild(tagsElement)
    });

    const commentsContainer = document.getElementById('comments'); 

    newsContent.responseContent.comments.forEach(comment => {

        const commsElement = document.createElement('div');
        commsElement.classList.add('comment')

        commsElement.innerHTML = `
        <div id = "user"> ${comment.author}</div>
        <div id = "text"> ${comment.comment_content}</div>`;

        commentsContainer.appendChild(commsElement);
    })
}

