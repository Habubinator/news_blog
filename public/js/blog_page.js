const userId = 1; //placeholder

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


    const userId = 2; //placeholder
    const news_id = 3; //placeholder
    var submitButton = document.getElementById('submit');

    submitButton.addEventListener("click", async function (event) {

        var commentForm = document.getElementById('commForm').value;

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

        if (response.status == 200){
            alert("Дякую за коментар.")
        }
        else if (response.status == 201){
            event.preventDefault();
            alert("Ви вже залишали коментар.")
            event.preventDefault();
        }
        else if (response.status == 401){
            alert("Напишіть коментар.")
            event.preventDefault();
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

    newsContent.responseContent.comments.forEach((comment) => {

        const commsElement = document.createElement('div');
        commsElement.classList.add('comment');
    
        commsElement.innerHTML = `
            <div id="user">${comment.author.username}</div>
            <div id="text">${comment.comment_content}</div>
            <button class="reply-button" id="reply-button-${comment.id}">Відповісти</button>
            <form class="comment-form" style="display: none;">
                <textarea name="comment" rows="4" cols="50" placeholder="Коментар тут"></textarea><br>
                <input type="submit" value="Відправити" id="submit-reply-${comment.id}" class = "submit-reply">
            </form>`;
    
        commentsContainer.appendChild(commsElement);
    
        const replyButton = commsElement.querySelector(`#reply-button-${comment.id}`);
        replyButton.addEventListener('click', () => toggleForm(commsElement));

        pullResponsesByCommentId(comment.id, commsElement);
        
    });

    document.addEventListener('click', async function (event) {
        if (event.target.classList.contains('submit-reply')) {
            const button = event.target;
            const form = button.closest('form');
            const commentFormValue = form.querySelector('textarea').value;
            const commentId = form.closest('.comment, .response').querySelector('.reply-button').id.split('-')[2];

            const response = await fetch("blog_page/submit_reply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    userId: userId,
                    reply_content: commentFormValue,
                    comment_id: commentId
                }),
            });

            if (response.status == 400){
                alert("Ви вже залишали відповідь.")
            }
        }
    });

    async function pullResponsesByCommentId(commentId, parentElement) {
        const response = await fetch(`/news/blog_page/responses/${commentId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                commentId: commentId
            }),
            
        });


        const data = await response.json();

        if (data.success) {
            data.responsesWithAuthors.forEach((response) => {
                const commsElement = document.createElement('div');
                commsElement.classList.add('response');
                commsElement.innerHTML = `
                    <div id="user">${response.author.username} відповів</div>
                    <div id="text">${response.comment_content}</div>
                    <button class="reply-button" id = "reply-button-${response.id}" >Відповісти</button>
                    <form class="comment-form" style="display: none;">
                    <textarea name="comment" rows="4" cols="50" placeholder="Коментар тут"></textarea><br>
                    <input type="submit" value="Відправити" id="submit-reply-${response.id}" class = "submit-reply">
                </form>`;

                const replyButton = commsElement.querySelector(`#reply-button-${response.id}`);
                replyButton.addEventListener('click', () => toggleForm(commsElement));
                    
                parentElement.appendChild(commsElement);

                pullResponsesByCommentId(response.id, commsElement);
            })
        } else {
            console.error('Ошибка при получении ответов:', data.message);
        }
    }

    function toggleForm(commsElement) {
        const commentForm = commsElement.querySelector('.comment-form');
        commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
    }

}

