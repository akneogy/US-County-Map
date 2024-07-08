// require('./usmapstyle.css');
const urlParams = new URLSearchParams(window.location.search);
const stateCode = urlParams.get('stateCode') ? urlParams.get('stateCode') : 'CA';
let stateCountyIDs = 0;
var simplemaps_countymap_mapdata = {
  main_settings: {
    //General settings
    width: "responsive", //or 'responsive'
    background_color: "#FFFFFF",
    background_transparent: "no",
    popups: "detect",

    //State defaults
    state_description: "State description",
    state_color: "#88A4BC",
    state_hover_color: "#3B729F",
    state_url: "http://simplemaps.com",
    border_size: 0.5,
    border_color: "#ffffff",
    all_states_inactive: "no",
    all_states_zoomable: "yes",

    //Location defaults
    location_description: "Location description",
    location_color: "#FF0067",
    location_opacity: 0.8,
    location_hover_opacity: 1,
    location_url: "",
    location_size: 25,
    location_type: "square",
    location_border_color: "#FFFFFF",
    location_border: 2,
    location_hover_border: 2.5,
    all_locations_inactive: "no",
    all_locations_hidden: "no",

    //Label defaults
    label_color: "#d5ddec",
    label_hover_color: "#d5ddec",
    label_size: 22,
    label_font: "Arial",
    hide_labels: "no",
    hide_eastern_labels: "no",

    //Zoom settings
    manual_zoom: "no",
    back_image: "no",
    arrow_box: "no",
    navigation_size: "40",
    navigation_color: "#f7f7f7",
    navigation_border_color: "#636363",
    initial_back: "no",
    initial_zoom: stateCode,
    initial_zoom_solo: "yes",
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,

    //Popup settings
    popup_color: "white",
    popup_opacity: 0.9,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
    popup_nocss: "no",

    //Advanced settings
    div: "map",
    auto_load: "yes",
    rotate: "0",
    url_new_tab: "no",
    images_directory: "default",
    import_labels: "no",
    fade_time: 0.1,
    link_text: "View Website",
    pop_ups: "detect",
    location_image_source: "frog.png",
    zoom: "yes",
    line_color: "#ffffff",
    line_size: "1.5"
  },
  locations: {
    "0": {
      name: "San Francisco",
      lat: "37.29",
      lng: "-122.0059731",
      description: "default",
      color: "default",
      url: "default",
      size: "default"
    }
  },
};

if (typeof window !== "undefined") {
  const error_modal = document.querySelector("#error_modal");
  const input_selector = document.querySelector("#state_input");
  let search_input = document.querySelector("#search_input");
  let search_container = document.querySelector("#search_container");
  let result_set = document.querySelector("#result_set")
  const colorList = JSON.parse(document.querySelector('.map_container').getAttribute('data-colorlist'));
  const URL = 'http://localhost:3000/countyAge'
  function stateModification() {
    fetch(URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response?.json();
      })
      .then(userData => {
        stateCountyIDs = window.simplemaps_countymap.mapinfo.default_regions[stateCode].states;
        const countyDataIDs = Object?.keys(userData);
        const countyNames = window.simplemaps_countymap.mapinfo.names;
        let state_specific = {};
        let averageAgeCounty = 0;
        for (let i = 0; i < countyDataIDs.length; i++) {
          if (stateCountyIDs.includes(countyDataIDs[i])) {
            averageAgeCounty = userData[countyDataIDs[i]].averageAge;
            let countyColorCode = (averageAgeCounty > 0 && averageAgeCounty <= 25) ? colorList[0] : (averageAgeCounty > 25 && averageAgeCounty <= 50)
              ? colorList[1] : (averageAgeCounty > 50 && averageAgeCounty <= 75) ? colorList[2] : colorList[3];
            state_specific[countyDataIDs[i]] = {
              name: countyNames[countyDataIDs[i]],
              description: "Average age of the County is :" + averageAgeCounty,
              color: countyColorCode
            }
          }
        }
        simplemaps_countymap_mapdata.state_specific = state_specific;
        simplemaps_countymap?.load();
      })
      .catch(error => {
        console.error('Error:', error);
        error_modal.style.display = 'block';
        document.querySelector("#legend").style.display = "none";
        document.querySelector("#legend_label").style.display = "none";
      });
  }

  function inputHandler() {
    input_selector.addEventListener("change", function (e) {
      urlParams.set("stateCode", e.target.value.toString().toUpperCase())
      history.replaceState(null, null, "?" + urlParams.toString());
      window.location.reload();
    })
  }

  function errorHandler() {
    document.querySelector("#close").addEventListener("click", function () {
      error_modal.style.display = "none";
    })
    document.querySelector("#cross_mark").addEventListener("click", function () {
      error_modal.style.display = "none";
    })
  }

  function searchHandler() {
    const suggestions = Object.keys(window.simplemaps_countymap.mapinfo.default_regions).map((key) => {
      return window.simplemaps_countymap.mapinfo.default_regions[key].name
    })
    let stateCodeMap = {};
    suggestions.forEach(element => {
      stateCodeMap[element] = Object.keys(window.simplemaps_countymap.mapinfo.default_regions)[suggestions.indexOf(element)];
    })
    search_input.onkeyup = (e) => {
      let userData = e.target.value;
      let emptyArray = [];
      if (userData) {
        emptyArray = suggestions.filter((data) => {
          return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
        });
        emptyArray = emptyArray.map((data) => {
          return data = '<li>' + '<a href="#" class="result_link">' + data + '</a>' + '</li>';
        });
        search_container.classList.add("active");
        autocompleteHandler(emptyArray);

        document.querySelectorAll(".result_link").forEach(box => box.addEventListener("click", () => {
          console.log("Test", document.activeElement.innerText)
          urlParams.set("stateCode", stateCodeMap[document.activeElement.innerText.toString()].toUpperCase())
          history.replaceState(null, null, "?" + urlParams.toString());
          window.location.reload();
        }))
      } else {
        search_container.classList.remove("active");
      }

      function autocompleteHandler(list) {
        let listData;
        if (!list.length) {
          let userValue = search_input.value;
          listData = '<li>' + '<a href="#" class="result_link">' + userValue + '</a>' + '</li>';
        } else {
          listData = list.join('');
        }
        result_set.innerHTML = listData;
      }
    }
  }
}

function stateModalHandler() {
  const state_modal_button = document.querySelector("#modal_button");
  const state_modal = document.querySelector("#state_modal")
  const cross_button = document.querySelector("#cross_button")
  const baseURL = 'http://127.0.0.1:5501/';
  const modal_grid = document.querySelector("#state_grid");
  state_modal_button.addEventListener("click", function () {
    state_modal.style.display = "block";
  })
  cross_button.addEventListener("click", function () {
    state_modal.style.display = "none";
  })
  const stateCode = Object.keys(window.simplemaps_countymap.mapinfo.default_regions);
  let stateCodeMap = {};
  stateCode.forEach(element => {
    stateCodeMap[element] = Object.keys(window.simplemaps_countymap.mapinfo.default_regions)[stateCode.indexOf(element)];
  })
  let modal_data = [];
  modal_data = stateCode.map(function (key) {
    return '<a id="state_modal_link" href="' + baseURL + 'test.html?stateCode=' + key + '">' + window.simplemaps_countymap.mapinfo.default_regions[key].name + "</a>"
  })
  for (let i = 0; i < modal_data.length; i++) {
    modal_grid.insertAdjacentHTML("afterbegin", modal_data[i])
  }
}

window.addEventListener('DOMContentLoaded', function () {
  stateModification();
  inputHandler();
  errorHandler();
  searchHandler();
  stateModalHandler();
})


