const STORAGE_KEY = "STORAGE_KEY";
const formAddData = document.getElementById("input_form");
const formSearchData = document.getElementById("search_form");

function checkThisStorage() {
  return typeof Storage !== "undefined";
}

formAddData.addEventListener("submit", function (event) {
  const title = document.getElementById("input_title").value;
  const author = document.getElementById("input_author").value;
  const year = parseInt(document.getElementById("input_years").value);
  const isComplete = document.getElementById("input_complete").checked;

  const idData = document.getElementById("input_title").name;
  if (idData !== "") {
    const allData = getBookData();
    for (let index = 0; index < allData.length; index++) {
      if (allData[index].id == idData) {
        allData[index].title = title;
        allData[index].author = author;
        allData[index].year = year;
        allData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
    DeletAllForm();
    renderThisBookList(allData);
    return;
  }

  const id =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) === null
      ? 0 + Date.now()
      : JSON.parse(localStorage.getItem(STORAGE_KEY)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  putBookData(newBook);

  const allData = getBookData();
  renderThisBookList(allData);
});

function putBookData(data) {
  if (checkThisStorage()) {
    let allData = [];

    if (localStorage.getItem(STORAGE_KEY) !== null) {
      allData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }

    allData.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }
}

function renderThisBookList(allData) {
  if (allData === null) {
    return;
  }

  const containerThisComplete = document.getElementById("incomplete_books");
  const containerComplete = document.getElementById("complete_books");

  containerThisComplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of allData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis : " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun : " + year + "</p>";

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const gnButton = newGnButton(book, function (event) {
      thisCOmpleteBooks(event.target.parentElement.parentElement);

      const allData = getBookData();
      DeletAllForm();
      renderThisBookList(allData);
    });

    const rdButton = newRdButton(function (event) {
      deletThisItem(event.target.parentElement.parentElement);

      const allData = getBookData();
      DeletAllForm();
      renderThisBookList(allData);
    });

    containerActionItem.append(gnButton, rdButton);

    bookItem.append(containerActionItem);

    if (isComplete === false) {
      containerThisComplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        updateThisItem(event.target.parentElement);
      });

      continue;
    }

    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      updateThisItem(event.target.parentElement);
    });
  }
}

function newRdButton(eventListener) {
  const rdButton = document.createElement("button");
  rdButton.classList.add("red");
  rdButton.innerText = "Hapus";
  rdButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return rdButton;
}

function newGnButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum Selesai " : "Selesai";

  const gnButton = document.createElement("button");
  gnButton.classList.add("green");
  gnButton.innerText = isSelesai + " dibaca ";
  gnButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return gnButton;
}
function thisSearchData(title) {
  const allData = getBookData();
  if (allData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < allData.length; index++) {
    const tempTitle = allData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (
      allData[index].title.includes(title) ||
      tempTitle.includes(tempTitleTarget)
    ) {
      bookList.push(allData[index]);
    }
  }
  return bookList;
}

function thisCOmpleteBooks(itemElement) {
  const allData = getBookData();
  if (allData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const thisNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < allData.length; index++) {
    if (
      allData[index].title === title &&
      allData[index].id == thisNameAttribut
    ) {
      allData[index].isComplete = !allData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

function GnButtonHandler(parentElement) {
  let book = thisCOmpleteBooks(parentElement);
  book.isComplete = !book.isComplete;
}

function getBookData() {
  if (checkThisStorage) {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }
  return [];
}

function deletThisItem(itemElement) {
  const allData = getBookData();
  if (allData.length === 0) {
    return;
  }

  const thisNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < allData.length; index++) {
    if (allData[index].id == thisNameAttribut) {
      allData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

function updateThisItem(itemElement) {
  if (
    itemElement.id === "incomplete_books" ||
    itemElement.id === "complete_books"
  ) {
    return;
  }

  const allData = getBookData();
  if (allData.length === 0) {
    return;
  }

  const title = itemElement.childNodes[0].innerText;
  const author = itemElement.childNodes[1].innerText.slice(
    9,
    itemElement.childNodes[1].innerText.length
  );
  const getyears = itemElement.childNodes[2].innerText.slice(
    7,
    itemElement.childNodes[2].innerText.length
  );
  const year = parseInt(getyearss);

  const isComplete =
    itemElement.childNodes[3].childNodes[0].innerText.length ===
    "Selesai dibaca".length
      ? false
      : true;

  const id = itemElement.childNodes[0].getAttribute("name");
  document.getElementById("input_title").value = title;
  document.getElementById("input_title").name = id;
  document.getElementById("input_author").value = author;
  document.getElementById("input_years").value = year;
  document.getElementById("input_complete").checked = isComplete;

  for (let index = 0; index < allData.length; index++) {
    if (allData[index].id == id) {
      allData[index].id = id;
      allData[index].title = title;
      allData[index].author = author;
      allData[index].year = year;
      allData[index].isComplete = isComplete;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
}

search_form.addEventListener("submit", function (event) {
  event.preventDefault();
  const allData = getBookData();
  if (allData.length === 0) {
    return;
  }

  const title = document.getElementById("search_title").value;
  if (title === null) {
    renderThisBookList(allData);
    return;
  }
  const bookList = thisSearchData(title);
  renderThisBookList(bookList);
});

function DeletAllForm() {
  document.getElementById("input_title").value = "";
  document.getElementById("input_author").value = "";
  document.getElementById("input_years").value = "";
  document.getElementById("input_complete").checked = false;

  document.getElementById("search_title").value = "";
}
window.addEventListener("load", function () {
  if (checkThisStorage) {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      const allData = getBookData();
      renderThisBookList(allData);
    }
  }
});
