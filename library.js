const articles = document.querySelector(".articles");
let savedId = JSON.parse(localStorage.getItem("savedId"));
const sortByTitleButton = document.querySelector("#sortBtn");
const sortByPublishedDateButton = document.querySelector("#sortBtn2");

let savedArticles = [];
let sorted = true;

function getArticle() {
  if (savedId !== null) {
    for (let i = 0; i < savedId.length; i++) {
      const GET_ARTICLES_BY_SAVED_ID = `https://api.spaceflightnewsapi.net/v3/articles/${savedId[i]}`;
      fetch(GET_ARTICLES_BY_SAVED_ID)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
          } else {
            return response.json();
          }
        })
        .then((data) => {
          createArticle(data);
          savedArticles.push(data);
        });
    }
  } else {
    return null;
  }
}

function createArticle(data) {
  const main = document.createElement("div");

  main.innerHTML = `
      <div class="article" key=${data.id}>
        <h2>${data.title}</h2>
        <div class="description">${data.summary.substring(0, 200)}</div>
        <p><strong>Source:</strong> ${data.newsSite}</p>
        <div class="date"><span style="margin-right: 5px;"><strong>Published: </strong></span> ${data.publishedAt.substring(
          0,
          10
        )}</div>
        <div class="articleButtons">
          <a href=${
            data.url
          } target="_blank"><button class="singleButton">Read article</button></a>
          <button class="singleButton" onClick="deleteElement(this, ${
            data.id
          })">Delete from Library</button>
        </div>
      </div>
    `;
  articles.appendChild(main);
}

function createArticleAfterSort(data) {
  let i = 0;
  while (i < savedArticles.length) {
    data.forEach(function (item) {
      const main = document.createElement("div");

      main.innerHTML = `
      <div class="article" key=${item.id}>
        <h2>${item.title}</h2>
        <div class="description">${item.summary.substring(0, 200)}</div>
        <p><strong>Source:</strong> ${item.newsSite}</p>
        <div class="date"><span style="margin-right: 5px;"><strong>Published: </strong></span> ${item.publishedAt.substring(
          0,
          10
        )}</div>
        <div class="articleButtons">
          <a href=${
            item.url
          } target="_blank"><button class="singleButton">Read article</button></a>
          <button class="singleButton" onClick="deleteElement(this, ${
            item.id
          })">Delete from Library</button>
        </div>
      </div>
    `;
      articles.appendChild(main);
      i++;
    });
  }
}

function deleteElement(e, id) {
  e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
  const element = savedId.indexOf(id);
  savedId.splice(element, 1);
  localStorage.setItem("savedId", JSON.stringify(savedId));
}

function sortArticlesByTitle() {
  if (sorted) {
    const sortedResponse = savedArticles.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
    });
    return sortedResponse;
  } else {
    const sortedResponse = savedArticles.sort(function (a, b) {
      if (a.title < b.title) {
        return 1;
      }
      if (a.title > b.title) {
        return -1;
      }
    });
    return sortedResponse;
  }
}

function sortArticlesByPublishedDate() {
  if (sorted) {
    const sortedResponse = savedArticles.sort(function (a, b) {
      if (a.publishedAt < b.publishedAt) {
        return -1;
      }
      if (a.publishedAt > b.publishedAt) {
        return 1;
      }
    });
    return sortedResponse;
  } else {
    const sortedResponse = savedArticles.sort(function (a, b) {
      if (a.publishedAt < b.publishedAt) {
        return 1;
      }
      if (a.publishedAt > b.publishedAt) {
        return -1;
      }
    });
    return sortedResponse;
  }
}

sortByTitleButton.addEventListener("click", () => {
  sortArticlesByTitle();
  sorted == true ? (sorted = false) : (sorted = true);
  articles.innerHTML = "";
  createArticleAfterSort(savedArticles);
});

sortByPublishedDateButton.addEventListener("click", () => {
  sortArticlesByPublishedDate();
  sorted == true ? (sorted = false) : (sorted = true);
  articles.innerHTML = "";
  createArticleAfterSort(savedArticles);
});

getArticle();
