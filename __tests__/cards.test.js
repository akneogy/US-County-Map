describe("when loadMoreButton() has fired", () => {

  document.body.innerHTML = `
    <h1>Load More Functionality</h1>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div id="cards_container">
        <div class="card">
           <img class="card-img-top" src="logo.jfif" alt="Card image cap">
           <div class="card-body">
             <h5 class="card-title"></h5>
             <p class="card-text"></p>
             <a href="#" class="btn btn-primary">Button Text</a>
          </div>
        </div>
        </div>
        <div class="button_container">
          <button id="load_more_button" type="button" class="btn btn-primary btn-block">Load More!</button>
        </div>
      </div>
    </div>
  </div>
  `;
  require('../cards_loading.js')

  it("It should contain ", () => {
    expect(document.querySelector("#cards_container")).toBeTruthy();
  });
   it("It should contain ", () => {
    expect(document.querySelector(".card")).toBeTruthy();
  });
   it("It should contain ", () => {
    expect(document.querySelector(".button_container")).toBeTruthy();
  });
   it("It should contain ", () => {
    expect(document.querySelector("#load_more_button")).toBeTruthy();
  });
});