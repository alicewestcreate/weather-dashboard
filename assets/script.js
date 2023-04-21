const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const historyDiv = document.querySelector("#history");
const historyButton = document.querySelector("#history-button");
const key = "62d5440eb21080da0f55dfad5e6d254d";

// -------- Initial Event Listener Function  --------//
// User clicks either enters a city fromSearch() or picks a previously searched city fromHistory(),
// from the history buttons to run the weather programme

let fromSearch = function (event) {
  event.preventDefault();
  let cityname = searchInput.value;
  let geoQuery =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityname +
    "&limit=5&appid=" +
    key;
  getGeoLocation(geoQuery);
};

let fromHistory = function (event) {
  let cityname = event.target.innerHTML;
  let geoQuery =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityname +
    "&limit=5&appid=" +
    key;
  getGeoLocation(geoQuery);
};

// -------- Find and Sort Data Function --------//

let getGeoLocation = function (geoQuery) {
  // This function gets the data from the weather API, and runs a series of functions
  // that retreieve the wanted data and outputs the data in dymically created HTML format.
  $.ajax({
    url: geoQuery,
    method: "GET",
    success: function (response01) {
      // First, get the city name, and the lonLat coords.

      let city = response01[0].name;
      let lat = response01[0].lat;
      let lon = response01[0].lon;

      createhistoryButton(city);
      setLocalStorage(city);

      let queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        key +
        "&units=metric";
      // Then enter the returned data into the next URL, to get the weather data for that location.
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response02) {
        list = response02.list; // Returns all weather data points for the next 5 days.
        selectedListItems = getSelectedListItems(list); // Runs func to select only data points for 12 noon each day.
        dataPointVariables = assignDataPointVariables(city, selectedListItems); // Sorts an array of data points, and selects required properties (temp, wind etc).

        displayMainForecast(dataPointVariables); // Dynamically displays the main forcast panel
        display5DayForecast(dataPointVariables); // Dynamically display the 5 day forcas boxes.
      });
    },
  });
};

let getSelectedListItems = function (list) {
  // This filters and select data points for 12 noon each day.
  selectedListItemsArray = [];
  list.forEach((item) => {
    timestamp = item.dt;
    hour = getHour(timestamp);
    if (hour === 13) {
      selectedListItemsArray.push(item);
    }
  });
  return selectedListItemsArray;
};

let getHour = function (timeStamp) {
  // Helper function to calculate the time as an hour.
  date = new Date(timeStamp * 1000);
  hour = date.getHours();
  formattedTime = hour;
  return hour;
};

let getDate = function (timeStamp) {
  // Helper function to calculate the date from seconds
  date = new Date(timeStamp * 1000);
  day = date.getDate();
  month = date.getMonth() + 1;
  year = date.getFullYear();
  formattedTime = `${day}/${month}/${year}`;
  formattedTime = `${day}/${month}`;

  return formattedTime;
};

let assignDataPointVariables = function (city, selectedListItems) {
  // This sorts through the array of data points, and assigns variables, for required properties.
  dataVariablesAssigned = [];
  selectedListItems.forEach((item) => {
    timeStamp = item.dt;
    formatteddate = getDate(timeStamp);

    item = {
      timeStamp: formatteddate,
      city: city,
      temp: item.main.temp,
      wind: item.wind.speed,
      humid: item.main.humidity,
      icon: item.weather[0].icon,
      desc: item.weather[0].description,
    };
    dataVariablesAssigned.push(item);
  });
  return dataVariablesAssigned;
};

// -------- Create HTML Elements --------//

let displayMainForecast = function (dataPointVariables) {
  // This takes the first set of datapoints, and dynamically updates the main box
  let firstItem = dataPointVariables[0];
  setBackground(firstItem.icon);

  const todayEl = document.querySelector("#today");
  todayEl.innerHTML = "";

  const mainForecast = document.createElement("div");
  mainForecast.setAttribute("class", "row mainForecast");

  let iconContainer = document.createElement("div");
  iconContainer.setAttribute("class", "col iconcontainer");

  let textContainer = document.createElement("div");
  textContainer.setAttribute("class", "col textContainer");

  let cityNameContainer = document.createElement("div");
  cityNameContainer.setAttribute("class", "row cityNameContainer");

  let weatherContainer = document.createElement("div");
  weatherContainer.setAttribute("class", "row weatherContainer");

  let icon = document.createElement("img");
  let iconURL =
    "http://openweathermap.org/img/wn/" + firstItem.icon + "@2x.png";
  icon.setAttribute("src", iconURL);

  let city = document.createElement("h2");
  city.innerText = firstItem.city;

  let date = document.createElement("p");
  date.innerText = firstItem.timeStamp;

  let temp = document.createElement("p");
  temp.innerText = `Temp: ${firstItem.temp} \°C`;

  let wind = document.createElement("p");
  wind.innerText = `Wind: ${firstItem.wind} KPH`;

  let humid = document.createElement("p");
  humid.innerText = `Humidity: ${firstItem.humid} \%`;

  let desc = document.createElement("p");
  desc.innerText = `can expect ${firstItem.desc} today`;

  iconContainer.appendChild(icon);

  cityNameContainer.appendChild(city);
  cityNameContainer.appendChild(date);

  weatherContainer.appendChild(desc);
  weatherContainer.appendChild(humid);
  weatherContainer.appendChild(temp);
  weatherContainer.appendChild(wind);

  textContainer.appendChild(cityNameContainer);
  textContainer.appendChild(weatherContainer);

  mainForecast.appendChild(textContainer);
  mainForecast.appendChild(iconContainer);

  todayEl.appendChild(mainForecast);
};

let display5DayForecast = function (dataPointVariables) {
  // This takes the all datapoints, and dynamically updates the 5 boxes.
  const forecastSection = document.querySelector("#forecast");

  forecastSection.innerHTML = "";

  dataPointVariables.forEach((set) => {
    let forecastBox = document.createElement("div");
    forecastBox.setAttribute("class", "col forecast");

    let icon = document.createElement("img");
    let iconURL = "http://openweathermap.org/img/wn/" + set.icon + ".png";
    icon.setAttribute("src", iconURL);

    let date = document.createElement("p");
    date.innerText = set.timeStamp;

    let temp = document.createElement("p");
    temp.innerText = `Temp: \n ${set.temp} \°C`;

    let wind = document.createElement("p");
    wind.innerText = `Wind: \n ${set.wind} KPH`;

    let humid = document.createElement("p");
    humid.innerText = `Humidity: \n ${set.humid} \%`;

    forecastBox.appendChild(icon);
    forecastBox.appendChild(date);
    forecastBox.appendChild(temp);
    forecastBox.appendChild(wind);
    forecastBox.appendChild(humid);
    forecastSection.appendChild(forecastBox);
  });
};

let setBackground = function (icon) {
  let bkgroundImg = "";
  switch (icon) {
    case "01d":
      bkgroundImg = "assets/images/clearClouds01.jpg";
      break;
    case "02d":
      bkgroundImg = "assets/images/02_fewClouds.jpg";
      break;
    case "03d":
        bkgroundImg = "assets/images/03_scatterClouds.jpg"
        break;
    case "04d":
        bkgroundImg = "assets/images/04_brokenClouds.jpg"
        break;
    case "09d":
        bkgroundImg = "assets/images/09_showerRain.jpg"
        break;
    case "10d":
        bkgroundImg = "assets/images/10_rain.jpg"
        break;
    case "11d":
        bkgroundImg = "assets/images/11_thunderStorm.jpg"
        break;
    case "13d":
        bkgroundImg = "assets/images/13_snow.jpg"
        break;
    case "50d":
        bkgroundImg = "assets/images/50_mist.jpg"
        break;
    default:
        bkgroundImg = "assets/images/rainbow.jpg"
      break;
  }

  const wrapEl = document.querySelector("#wrap");
  wrapEl.style.backgroundImage = `url(${bkgroundImg})`;
  wrapEl.setAttribute("class", "wrap");

};

// ------- HISTORY BUTTONS -------//

let searchHistory = [];
let setLocalStorage = function (cityname) {
  //This checks if a city name has already been seached, in the searchHistory array, if false, adds items to search history.
  check = searchHistory.includes(cityname);
  if (check == false) {
    currentSearch = cityname;
    searchHistory.push(currentSearch);
    localStorage.setItem("history", JSON.stringify(searchHistory));
  }
};

let getLocalStorage = function () {
  // Onload, this retrieves the city searched history,
  // and creates buttons for each one.
  let searchHistory = JSON.parse(localStorage.getItem("history"));
  searchHistory.forEach((city) => {
    createhistoryButton(city);
  });
};

let buttonHistory = [];
let createhistoryButton = function (cityname) {
  // This checks if a button has already been created, if false, it creates a button.
  check = searchHistory.includes(cityname);
  if (check == false) {
    buttonHistory.push(cityname);
    let historyButton = document.createElement("button");
    historyButton.setAttribute(
      "class",
      "history inline-block btn search-button"
    );
    historyButton.setAttribute("data-city", cityname);
    historyButton.innerHTML = cityname;
    historyDiv.appendChild(historyButton);
  }
};

// ------- EVENT LISTENERS -------//

addEventListener("load", getLocalStorage); // Onload, create buttons from historic search / local storage.

searchButton.addEventListener("click", fromSearch); // Get weather information from search input

$(historyDiv).on("click", ".history", fromHistory); // Get weather information from historic button, through a delgated event listener.
