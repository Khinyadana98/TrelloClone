
let listMenuPopup,clickedListId;
var list = [];
const endpoint = "https://trello-clone-ppm.herokuapp.com";
const listWrapper = document.getElementById("wrapper");
const exampleModalTitle = document.getElementById("exampleModalTitle");
const cardDescId = document.getElementById("cardDescId");
// const addAnotherListBtn=` <button class="btn btn-lg add-list text-left " id="add-list-btn" onclick="addNewList(event)">
// <i class="fa fa-plus"></i> &nbsp;&nbsp;&nbsp;Add another list
// </button> &nbsp;&nbsp;&nbsp;`;


const setLoading = (isLoading) => {
  document.getElementById("centerhold").innerHTML = isLoading ? loader:logo;
};
window.onload = () => {
  listMenuPopup = document.getElementById("list-menu-popup");
  displayData();
};

function displayData() {
  fetch(endpoint + "/list")
    .then((response) => response.json())
    .then(function (data) {
      list = data;
      console.log(data);
      const allListHtmlStr =
        list.map((l) => toListHtmlString(l)).join("") ;
      listWrapper.innerHTML = allListHtmlStr;
    });
}
function toListHtmlString(l) {
  return `
   <div class="col">
   <div class="card mt-2 ml-1" style=" 
   background-color: #EBECF0;
 ">
     <div class=" trello-list d-flex align-items-center justify-content-between"  list-id="${list.id}">
       <h5 class="pt-2 pl-3" style="font-size:14px">${l.title}</h5>
       <button class="btn btn-sm text-muted m-1 btn-ell"  list-id="${list.id}" onclick="listOption(event)"><i class="fas fa-ellipsis-h"></i></button>
     </div> 

     ${l.cards && l.cards.map((card) => toCardHtmlString(card)).join("")}
 
<button class="add btn btn-sm text-muted p-2 m-2">
 <i class="fas fa-plus"></i>&nbsp;&nbsp;Add another card
</button>
   </div>
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
  cardDescId.innerHTML = card.description ? card.description : "";
}

function getSmallCard(dom) {
  if (dom.classList.contains("smallcards")) {
    return dom;
  }
  return getSmallCard(dom.parentElement);
}


function listOption(event) {
  event.stopPropagation();
  if(listMenuPopup.style.display == "block") {
    listMenuPopup.style.display = "none";
  } else {

    let btn = event.target;  
    if(btn.nodeName == "i" || btn.nodeName == "I") {
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
  if(clickedListId) {
    // closeOptionMenu();
    if(confirm("Are you sure to delete this list?")) {
      // setLoading(true);
      fetch(`${endpoint}/list/${clickedListId}`, {
        method: "DELETE"
      })
      .then(res => {
        console.log(res);
        // setLoading(false);
        const listToRemove = document.querySelector(`.trello-list[list-id="${clickedListId}"]`);
        if(res.ok && listToRemove) {
          listToRemove.remove();
          clickedListId = undefined;
        }
      })
      .catch(err => {
        console.log(err);
        // setLoading(false);
        clickedListId = undefined;
      })
    }
  }
}
