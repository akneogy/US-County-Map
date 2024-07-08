// require("./cards.css");
const load_more_button = document.querySelector("#load_more_button")
const URL = "https://jsonplaceholder.typicode.com/posts"
const cards_container = document.querySelector("#cards_container");
let globalData;
let start_val = 0;
let end_val = 12;
async function fetchData() {
  const response = await fetch(URL).catch((error) => {
    console.log(error);
    load_more_button.style.display = "none";
  });
  globalData = await response.json();
  console.log("CALLED", globalData);
  injectCards(start_val,end_val);
  return globalData;
}
function injectCards(start,end) {
  globalData.slice(start,end).forEach((obj) => {
    cards_container.insertAdjacentHTML('beforeend', `
           <div class="card">
           <img class="card-img-top" src="logo.jfif" alt="Card image cap">
           <div class="card-body">
             <h5 class="card-title">${obj.title} ${globalData.indexOf(obj)}</h5>
             <p class="card-text">${obj.body}</p>
             <a href="#" class="btn btn-primary">Button Text</a>
          </div>
        </div>
      `)
    end_val = end;
  })

}
function loadMoreButtonHandler() {
  load_more_button.addEventListener("click", function (e) {
    e.preventDefault();
    injectCards(end_val+1,end_val+13);
    if(end_val>=globalData.length){
      load_more_button.style.display = "none";
    }
  }
  );
}
window.addEventListener('DOMContentLoaded', function () {
  fetchData();
  loadMoreButtonHandler();
});
