// JavaScript to make FAQ collapsible
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        // Toggle the active class on the parent element
        const parent = question.parentElement;
        parent.classList.toggle("active");

        // Close other open items (optional: if you want only one open at a time)
        document.querySelectorAll(".faq-item").forEach((item) => {
            if (item !== parent && item.classList.contains("active")) {
                item.classList.remove("active");
            }
        });
    });
});