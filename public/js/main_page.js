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
});
