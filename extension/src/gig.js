import TurndownService from "turndown";
const convertmd = new TurndownService();

const emptyMessage = "Not Found in the Gig"


export function getTitle() {
    const titleElement = document.querySelector("div.gig-overview h1");
    if (!titleElement) return null;
    return titleElement
        .textContent
        .trim()
        .toLowerCase()
        .replace("i will", "")
        .trim()
}


export function getDescription() {
    const description = document.querySelector("div.description-wrapper div.description-content") || document.querySelector("div.about-gig div.m2d0eb1cs");
    if (!description) return null;
    return convertmd.turndown(description.innerHTML).trim().replace(/\s+/g, " ") 
}


export function getCategoryAndSubcategory() {
    const breadcrumbElement = document.querySelector("ol.m2d0eb0");
    if (!breadcrumbElement) return null;
    return breadcrumbElement
        .textContent
        .replaceAll("/", ">")
        .trim();
}


export function getExpertise() {
    const expertiesElement = document.querySelector("ul.metadata");

    let expertiesJson = [];
    if (expertiesElement) {
        const finalExpertiesElement = expertiesElement.querySelectorAll("li.metadata-attribute");
        if (!finalExpertiesElement) return emptyMessage;

        finalExpertiesElement.forEach((el) => {
            const title = el.querySelector("p")?.textContent?.trim().replace(/\s+/g, " ");

            const items = [...el.querySelectorAll("ul li")].map(li =>
                li.textContent.trim().replace(/\s+/g, " ")
            );

            if (title) {
                expertiesJson.push({
                    title,
                    items
                });
            }
        });
    }
    return expertiesJson
}


export function getPackage() {
    const packageTabs = document.querySelectorAll("div.packages-tabs div.nav-container label");
    const packages = {};

    try {
        packageTabs.forEach((tab) => {
            if (!tab) return emptyMessage;
            tab.click();

            const content = document.querySelector("div.packages-tabs div.package-content");
            const content_revisions = content.querySelector("div.additional-info div.revisions-wrapper b.revisions")
            packages[tab.textContent.trim()] = {
                "heading": content.querySelector("b.package-header-title").textContent.trim(),
                "pricing": content.querySelector("span").textContent.trim(),
                "description": content.querySelector("p").textContent.trim(),
                "delievery_time": content.querySelector("div.additional-info div.delivery-wrapper b.delivery").textContent.trim(),
                "revisions": content_revisions ? content_revisions.textContent.trim() : "this gig have no revsion option.",
                "includes": [...content.querySelectorAll("div.collapsable-package-item div.collapsible-content ul li")]
                    .filter(li => li.querySelector("span")?.classList.contains("ff7c5d1"))
                    .map(li => li.textContent.trim())
            };
        });
    }
    catch (e) {
        console.error("Package extraction error:", e);
    }

    const item = document.querySelector(".collapsable-package-item");
    const header = item?.querySelector(".collapsable-header");

    if (item?.classList.contains("collapsed") || header?.classList.contains("collapsed")) {
        header?.click();
    }
    return packages
}



export function getSellerProfile() {
    const profileElement = document.querySelector("article.seller-desc div.inner");
    if(!profileElement) return emptyMessage
    return convertmd.turndown(profileElement.textContent.trim())
}



export function getTags() {
    const tagsElement = document.querySelector("div.gig-tags-container ul")
    if (!tagsElement) return emptyMessage
    const tags = [...tagsElement.querySelectorAll(" li")]
        .map(tag => tag.innerText.trim())
        .join(", ");
    return tags
}


export function getRatings() {
    let rating_json = []
    const ratings = document.querySelector("div.ranking ul");
    if (!ratings) return emptyMessage;
    ratings.querySelectorAll("li").forEach((rating) => {
        let key = rating.childNodes[0]
            .textContent
            .trim()
            .replace(":", "")
            .replaceAll(" ", "_")

        let value = rating.querySelector("span").textContent.trim();
        rating_json.push({ [key]: parseFloat(value) })
    })
    return rating_json;
}



export function getTotalOrders() {
    const totalReviewsElement = document.querySelector("header.reviews-header div.details span._1fe1trbk span")
    if (!totalReviewsElement) return 0;
    return parseInt(totalReviewsElement.textContent
        .trim()
        .replace(",", "")
        .trim());
}



export function getStarsReviews() {
    const reviewsPerStar = document.querySelectorAll("table.stars-counters tbody tr")
    if (reviewsPerStar.length === 0) return emptyMessage;
    let starReviews = {}
    reviewsPerStar.forEach(el => {
        starReviews[el.querySelector("span.stars-filter-wrapper").innerText.trim()] = el.querySelector("td.star-num").innerText.trim()
    })
    return starReviews;
}



export function getSellerInfo() {
    const profileCredentials = document.querySelectorAll("ul.user-stats li");
    if (profileCredentials.length === 0) return emptyMessage;

    const sellerInfo = {}
    profileCredentials.forEach(el => {
        const strong = el.querySelector("strong");
        if (!strong) return;
        const key = el.querySelector("p")?.innerText.trim() || el.textContent.replace(strong.textContent, "").trim();
        sellerInfo[key] = strong.textContent.trim();
    })
    return sellerInfo;
}


export function getGigUrl() {
    const url = new URL(window.location.href)
    url.search = ""
    return url.toString()
}

export function getProfileStatus() {``
    const status = document.querySelector("div.seller-overview p.m2d0eb2")
    if (!status) return "fresher"
    return status.textContent.trim()
}