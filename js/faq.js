(function () {
    const items = Array.from(document.querySelectorAll(".faq-item"));
    const buttons = Array.from(document.querySelectorAll(".faq-category"));
    const search = document.getElementById("faqSearch");
    const heading = document.getElementById("faqHeading");
    const empty = document.getElementById("faqEmpty");
    let filter = "all";

    function apply() {
        const q = search.value.trim().toLowerCase();
        let shown = 0;
        items.forEach(function (item) {
            const inCategory = filter === "all" || item.dataset.category === filter;
            const matches = !q || item.textContent.toLowerCase().includes(q);
            item.hidden = !(inCategory && matches);
            if (!item.hidden) shown++;
        });
        empty.hidden = shown > 0;
    }

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filter = btn.dataset.filter;
            buttons.forEach(function (b) {
                b.classList.toggle("active", b === btn);
                b.setAttribute("aria-pressed", b === btn ? "true" : "false");
            });
            heading.textContent = btn.textContent.trim();
            apply();
        });
    });
    search.addEventListener("input", apply);
})();