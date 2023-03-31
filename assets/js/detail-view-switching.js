---
---

var currentDetailPageNum = 0;
const detailPageMax = {{ site.data.strings.detail_pages.ids | size | minus:1 }};
const detailPageViewIDs = {{ site.data.strings.detail_pages.ids | jsonify }};
const detailPageTitles = {{ site.data.strings.detail_pages.titles | jsonify }};

function leftDetailButtonClicked() {
    currentDetailPageNum -= 1;
    if (currentDetailPageNum < 0) {
        currentDetailPageNum = detailPageMax
    }

    updateDetailPageVisibility();
}

function rightDetailButtonClicked() {
    currentDetailPageNum += 1;
    if (currentDetailPageNum > detailPageMax) {
        currentDetailPageNum = 0
    }

    updateDetailPageVisibility();
}

function updateDetailPageVisibility() {
    detailPageViewIDs.forEach((id, i) => {
        if (i == currentDetailPageNum) {
            const currentPage = document.getElementById(id);
            currentPage.classList.add('current-detail-page');
            currentPage.classList.remove('hidden-detail-page');
        } else {
            const otherPage = document.getElementById(id);
            otherPage.classList.remove('current-detail-page');
            otherPage.classList.add('hidden-detail-page');
        }
    });

    const currentDetailPageTitleSpan = document.getElementById('current-detail-page-title');
    if (currentDetailPageTitleSpan) {
        currentDetailPageTitleSpan.textContent = detailPageTitles[currentDetailPageNum];
    }
}
