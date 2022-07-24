const container = document.querySelector(".container");
const content = document.querySelector(".container__content");
const libraryBtn = document.querySelector(".libraryBtn");
const amountInput = document.querySelector(".amount");
const totalAmount = document.querySelector(".total");
const articles = document.querySelector(".articles");

let startNumber = 0;
const defaultValue = 15;
let timer;
let savedId = [];
savedId = JSON.parse(localStorage.getItem("savedId", "[]")) || [];

function getTotalArticles() {
  const GET_TOTAL_ARTICLES_AMOUNT =
    "https://api.spaceflightnewsapi.net/v3/articles/count";
  fetch(GET_TOTAL_ARTICLES_AMOUNT)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      totalAmount.innerHTML = `${Number(
        localStorage.getItem("count")
      )} / ${data}`;
    });
}

function getArticles(amount, startNumber) {
  const GET_ARTICLES_BY_LIMIT_AND_START = `https://api.spaceflightnewsapi.net/v3/articles?_limit=${amount}&_start=${startNumber}`;
  fetch(GET_ARTICLES_BY_LIMIT_AND_START)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then((data) => {
      createArticle(amount, data);
    });
}

function createArticle(amount_of_articles, data) {
  let i = 0;
  while (i < amount_of_articles) {
    data.forEach(function (item) {
      const main = document.createElement("div");
      let saveArticleButtonName = check(item);

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
          <button class="singleButton" onclick="handleSaveArticle(${
            item.id
          },this)">${saveArticleButtonName}</button>
        </div>
      </div>
    `;
      articles.appendChild(main);
      i++;
    });
  }
}

function handleSaveArticle(id, saveArticleButton) {
  if (saveArticleButton.textContent === `Add to Library`) {
    if (localStorage.getItem(savedId === null)) {
      savedId.push(id);
      localStorage.setItem("savedId", JSON.stringify(savedId));
    } else if (savedId.indexOf(id) === -1) {
      savedId.push(id);
      localStorage.setItem("savedId", JSON.stringify(savedId));
    }
  } else {
    const element = savedId.indexOf(id);
    savedId.splice(element, 1);
    localStorage.setItem("savedId", JSON.stringify(savedId));
  }
  saveArticleButton.textContent == "Add to Library"
    ? (saveArticleButton.textContent = "Remove From Library")
    : (saveArticleButton.textContent = "Add to Library");
}

function check(item) {
  let savedId2 = JSON.parse(localStorage.getItem("savedId"));
  if (savedId2 === null) {
    return `Add to Library`;
  } else if (savedId2.includes(item.id)) {
    return `Remove from Library`;
  } else {
    return `Add to Library`;
  }
}

function getCount() {
  return Number(localStorage.getItem("count"));
}

amountInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    let amountInput_value = Number(amountInput.value);
    if (amountInput_value === 0) {
      startNumber += 15;
      getArticles(defaultValue, startNumber);
      const newCount = getCount() + defaultValue;
      localStorage.setItem("count", newCount);
    } else {
      let newStart = Number(localStorage.getItem("count"));
      newStart += amountInput_value;
      getArticles(amountInput_value, newStart);
    }
    const newCount = getCount() + amountInput_value;
    localStorage.setItem("count", newCount);
    getTotalArticles();
  }
});

function limitCallback(callback, time) {
  if (timer) return;

  timer = true;

  setTimeout(() => {
    callback();
    timer = false;
  }, time);
}

function handleScroll() {
  limitCallback(() => {
    let endOfPage =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (endOfPage) {
      let amountInput_value = Number(amountInput.value);
      if (amountInput_value === 0) {
        let newStart = Number(localStorage.getItem("count"));
        let newCount = (newStart += 15);
        localStorage.setItem("count", newCount);
        getArticles(defaultValue, newStart);
        getTotalArticles();
      } else {
        let newStart = Number(localStorage.getItem("count"));
        let newCount = (newStart += amountInput_value);
        localStorage.setItem("count", newCount);
        getArticles(amountInput_value, newStart);
        getTotalArticles();
      }
    }
  }, 1000);
}

getArticles(defaultValue, startNumber);
localStorage.setItem("count", defaultValue);
getTotalArticles();

window.addEventListener("scroll", handleScroll);
