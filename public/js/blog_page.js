
document.addEventListener("DOMContentLoaded", function () {

   fetch(`/news/blog_page/news_content`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {

                        console.log('data');
                        console.log(data);

                        const newsContent = data;


                        console.log("Slurp")
                        console.log(newsContent);
                        
                        pullContent(newsContent); 
                    } else {
                        console.error('Error:', data.message);
                    }
                })
        .catch(error => console.error('Error:', error)); 
});

function pullContent(newsContent) {

    console.log("Entered function")
    console.log(newsContent)

    const titleContainer = document.getElementById('news-title');
    titleContainer.innerHTML = newsContent.responseContent.title;

    const authorContainer = document.getElementById('news_author');
    authorContainer.innerHTML = "Author: " + newsContent.responseContent.author.username;

    const contentContainer = document.getElementById('news_content');
    contentContainer.innerHTML = newsContent.responseContent.news_content;

    const tagsContainer = document.getElementById('tags-container'); 
    console.log(tagsContainer);

    newsContent.responseContent.tags.forEach(tag_name => {
        
        const tagsElement = document.createElement('div');
        tagsElement.innerHTML = tag_name.tag_name;

        tagsElement.classList.add("tag")

        
        console.log(tag_name.tag_name);
        console.log(tagsElement);
        console.log(tagsContainer)

        tagsContainer.appendChild(tagsElement)

        console.log(tagsContainer);
    });
}

