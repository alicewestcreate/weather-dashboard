const searchInput = document.querySelector("#search-input")
const searchButton = document.querySelector("#search-button")

const key = "62d5440eb21080da0f55dfad5e6d254d"


let getGeoLocation = function(event)  {
    event.preventDefault();

    let cityname = searchInput.value;
    let geoQuery = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityname + "&limit=5&appid=" + key;

    $.ajax({
        url: geoQuery,
        method: "GET",
        success: function(response01){
            console.log(response01)
            lat = response01[0].lat
            lon = response01[0].lon
            let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&units=metric"

            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function(response02) {
                console.log(response02)
                list = response02.list
                selectedListItems = getSelectedListItems(list) // An array with the values of noon only 
                // Assign variable to each of the values 
                dataPointVariables = assignDataPointVariables(selectedListItems) // Each data point is assigned a to a dic key/value pair
                console.log(dataPointVariables)
                displayMainForecast(dataPointVariables)
                //dynamically create elements: 
                display5DayForecast(dataPointVariables)                

            })
        }
    })
}


let getSelectedListItems = function(list) {
    // The whole forecast is stored in the list property. This function gets the forecast, 
    // and selects the data for every forecast at noon. And pushes it to a new array.
    selectedListItemsArray = []
    list.forEach(item => {
        timestamp = item.dt
        hour = getHour(timestamp)
        if (hour === 12){
            selectedListItemsArray.push(item)   
        }        
    });
    console.log(selectedListItemsArray)
    return selectedListItemsArray
}


let getHour = function(timeStamp) {
    date = new Date(timeStamp * 1000)
    hour = date.getHours()
    formattedTime = (hour)
    return hour
}

let getDate = function(timeStamp) {
    date = new Date(timeStamp * 1000)
    day = date.getDate()
    month = date.getMonth()+1
    year = date.getFullYear()
    formattedTime = (`${day}/${month}/${year}`)
    return formattedTime
}


let assignDataPointVariables = function(selectedListItems) {
    // This function goes through the selected list items and assigns the required data points to set keys/variable
    dataVariablesAssigned = []
    selectedListItems.forEach(item => {
        timeStamp = item.dt
        formatteddate = getDate(timeStamp)

        item = {
            timeStamp: formatteddate,
            temp: item.main.temp,
            wind: item.wind.speed,
            humid: item.main.humidity,
            icon: item.weather[0].icon,
        }
        dataVariablesAssigned.push(item)
    });
    return dataVariablesAssigned
}


let displayMainForecast = function(dataPointVariables){
    // This function, gets the first set of variables, dynamically creates the 
    // HTML elements and builds out the forecast for today

    let firstItem = dataPointVariables[0]

    const todayEl = document.querySelector("#today")

    todayEl.innerHTML = ""

    const mainForecast = document.createElement("div")
    mainForecast.setAttribute("class", "col mainForecast")

    let date = document.createElement("p")
    date.innerText = firstItem.timeStamp

    let icon = document.createElement("img")
    let iconURL = "http://openweathermap.org/img/wn/" + firstItem.icon + ".png"
    icon.setAttribute("src", iconURL)

    let temp = document.createElement("p")
    temp.innerText = (`Temp: ${firstItem.temp} \°C`)

    let wind = document.createElement("p")
    wind.innerText = (`Wind: ${firstItem.wind} KPH`)

    let humid = document.createElement("p")
    humid.innerText = (`Humidity: ${firstItem.humid} \%`)

    mainForecast.appendChild(date)
    mainForecast.appendChild(icon)
    mainForecast.appendChild(temp)
    mainForecast.appendChild(wind)
    mainForecast.appendChild(humid)
    todayEl.appendChild(mainForecast)  
}


let display5DayForecast = function(dataPointVariables) {
    // This function, uses a foreach loop to dynamically creates the 
    // HTML elements and build out the 5 day forcast
    console.log(dataPointVariables)
    const forecastSection = document.querySelector("#forecast")

    forecastSection.innerHTML = ""

    dataPointVariables.forEach(set => {
        console.log(set)
        let forecastBox = document.createElement("div")
        forecastBox.setAttribute("class", "col forecast")
        
        let date = document.createElement("p")
        date.innerText = set.timeStamp

        let icon = document.createElement("img")
        let iconURL = "http://openweathermap.org/img/wn/" + set.icon + ".png"
        icon.setAttribute("src", iconURL)

        let temp = document.createElement("p")
        temp.innerText = (`Temp: ${set.temp} \°C`)

        let wind = document.createElement("p")
        wind.innerText = (`Wind: ${set.wind} KPH`)

        let humid = document.createElement("p")
        humid.innerText = (`Humidity: ${set.humid} \%`)

        forecastBox.appendChild(date)
        forecastBox.appendChild(icon)
        forecastBox.appendChild(temp)
        forecastBox.appendChild(wind)
        forecastBox.appendChild(humid)
        forecastSection.appendChild(forecastBox)
    
    });


}





// let weatherTodayFunc = function(weatherToday){

//     // Format Time Stamp = DD/MM/YYYY
//     date = new Date(weatherToday.timeStamp * 1000)
//     console.log(date)
//     day = date.getDate()
//     month = date.getMonth()+1
//     year = date.getFullYear()
//     formattedDate = (day + "/" + month + "/" + year)


//     // Insert all items into Todays weather. 
//     cityNameText.textContent = weatherToday.city 
//     todaysDate.textContent = formattedDate
//     todayTemp.textContent = weatherToday.temp + "\°C"
//     todayWind.textContent = weatherToday.wind + "KPH"
//     todayHum.textContent = weatherToday.hum + "\%"
//     weatherIcon = weatherToday.icon

//     iconURL = "http://openweathermap.org/img/wn/" + weatherIcon + ".png"
//     console.log(iconURL)
//     icon0.setAttribute("src", iconURL)
// }











searchButton.addEventListener("click", getGeoLocation)




