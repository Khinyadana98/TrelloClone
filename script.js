var list = [];
let listMenuPopup;
var addListPopup;
var clickedListId;
const endpoint = "https://trello-clone-ppm.herokuapp.com";
const listWrapper = document.getElementById("wrapper");
const exampleModalTitle = document.getElementById("modal-h1");
const cardDescId = document.getElementById("modal-description");
  // const listTitleforCard= document.getElementById("modal-a");
const addListBtn = `
  <button class="btn btn-lg add-list m-1 text-left mr-3" id="add-list-btn" onclick="addNewList(event)">
    <i class="fa fa-plus"></i>&nbsp;&nbsp;&nbsp;Add another list
  </button>
  <div style="width: 0.5rem">&nbsp;</div>
`;
window.onload = () => {
  addListPopup = document.getElementById("add-list-popup");
  listMenuPopup = document.getElementById("list-menu-popup");
  limitWrapperHeight();

  displayData();
};

function limitWrapperHeight() {
  const body = document.documentElement.clientHeight;
  const nav1 = document.getElementById("first-nav").clientHeight;
  const nav2 = document.getElementById("second-nav").clientHeight;
  const wrapper = document.getElementById("wrapper");
  wrapper.style.maxHeight = body - nav1 - nav2 + "px";
  wrapper.style.minHeight = body - nav1 - nav2 + "px";
}

function addNewList(event) {
  event.stopPropagation();
  if (addListPopup) {
    const addNewListBtn = document.getElementById("add-list-btn");
    const rect = addNewListBtn.getBoundingClientRect();
    console.log(rect);

    addListPopup.style.top = rect.top + "px";
    addListPopup.style.left = rect.left + "px";
    addListPopup.style.width = rect.width + "px";
    toggelAddListPopup(true);
  }
}


function wrapperScrolled() {
  closeOptionMenu();
  if(addListPopup.style.display === "block") {
    const rect = document.getElementById("add-list-btn").getBoundingClientRect();
    addListPopup.style.top = rect.top + "px";
    addListPopup.style.left = rect.left + "px";
  }
}

function toggelAddListPopup(isOpen) {
  if(addListPopup) {
    addListPopup.style.display = isOpen ? "block":"none";
    if(isOpen) {
      document.getElementById("list-title-input").focus();
    }
  }
}

function inputEntered(event) {
  if(event.keyCode == 13){
    // detect Enter key, if user hits enter then save new list
    saveNewList();
  }
}

function saveNewList() {
  const listTitleInput = document.getElementById("list-title-input");
  const listTitle = listTitleInput.value;
  if(listTitle) {
    // setLoading(true);
    fetch(endpoint + "/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: listTitle,
        position: list.length + 1
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // setLoading(false);
      listTitleInput.value = "";
      toggelAddListPopup(false);
      // fetchData();
      const doc = new DOMParser().parseFromString( toListHtmlString(data), "text/html");
      const newlyAddedList = doc.body.children[0];
      document.getElementById("add-list-btn").before(newlyAddedList);
      list.push(data);
    })
    .catch(err => {
      console.log(err);
      // setLoading(false);
    })
  }
}



function displayData() {
  fetch(endpoint + "/list")
    .then((response) => response.json())
    .then(function (data) {
      list = data;
      console.log(data);
      const allListHtmlStr = list.map((l) => toListHtmlString(l)).join("") + addListBtn;
      listWrapper.innerHTML = allListHtmlStr;
    });
}
function toListHtmlString(l) {
  return `

  <div class="trello-list rounded m-1 px-2 py-1 trello-fadein" list-id="${l.id}">

  <div class="d-flex justify-content-between align-items-center mb-1">
      <h6 class="pl-2">${l.title}</h6>
      <button class="btn btn-sm stretch-x" list-id="${l.id}" onclick="listOption(event)"><i class="fa fa-ellipsis-h"></i></button>
  </div>

  ${l.cards && l.cards.map((card) => toCardHtmlString(card)).join("")}

  <div class="d-flex justify-content-between align-items-center mt-1">
      <button class="btn btn-sm text-left" id="add-new-card"><i class="fa fa-plus"></i>&nbsp;&nbsp;Add another card</button>
      <button class="btn btn-sm"><i class="fa fa-window-maximize"></i></button>
  </div>

</div>
   `;
}

function toCardHtmlString(card) {
  return `
  <div>
  <div class="cardBody smallcards m-1" data-toggle="modal" data-target="#exampleModal" card-id="${
    card.id
  }" list-id="${list.id}"  onclick="onCardClicked(event)">
   <p>${card.title}</p>
   ${
     card.description
       ? `<button class="btn btn-sm text-muted"><i class="fas fa-align-left"></i></button>  `
       : ""
   }
   <button class="btn btn-sm text-muted"><i class="fas fa-paperclip"></i></button>
  </div>
  </div>
  `;
}

function onCardClicked(event) {
  const smallCardUi = getSmallCard(event.target);
  const clickedCardId = smallCardUi.getAttribute("card-id");
  let card = null;
  for (let i = 0; i < list.length; i++) {
    if (list[i].cards) {
      const ind = list[i].cards.findIndex((c) => +c.id === +clickedCardId);
      if (ind != -1) {
        card = list[i].cards[ind];
        break;
      }
    }
  }
  exampleModalTitle.innerHTML = card.title;
  listTitleforCard .innerHTML = list.title;

  cardDescId.innerHTML = card.description ? card.description : "";

}

function getSmallCard(dom) {
  if (dom.classList.contains("smallcards")) {
    return dom;
  }
  return getSmallCard(dom.parentElement);
}
function closeOptionMenu() {
  if (listMenuPopup.style.display == "block") {
    listMenuPopup.style.display = "none";
  }
}



function listOption(event) {
  event.stopPropagation();
  if (listMenuPopup.style.display == "block") {
    listMenuPopup.style.display = "none";
  } else {
    let btn = event.target;
    if (btn.nodeName == "i" || btn.nodeName == "I") {
      btn = btn.parentNode;
    }
    clickedListId = btn.getAttribute("list-id");

    const loc = btn.getBoundingClientRect();

    listMenuPopup.style.top = loc.top + loc.height + 5 + "px";

    listMenuPopup.style.left = loc.left + "px";
    listMenuPopup.style.display = "block";
  }
}

function goDeleteList() {
  if (clickedListId) {
    closeOptionMenu();
    if (confirm("Are you sure to delete this list?")) {
      // setLoading(true);
      fetch(`${endpoint}/list/${clickedListId}`, {
        method: "DELETE",
      })
        .then((res) => {
          console.log(res);
          // setLoading(false);
          const listToRemove = document.querySelector(
            `.trello-list[list-id="${clickedListId}"]`
          );
          if (res.ok && listToRemove) {
            listToRemove.remove();
            clickedListId = undefined;
          }
        })
        .catch((err) => {
          console.log(err);
          // setLoading(false);
          clickedListId = undefined;
        });
    }
  }
}
