// Declaring global variables //
var cityList = [];
var recentlySearched = [];
var APIKey = "8c933dc3854df7652847236dd545f2b4";
var currentDay = moment().format("MM-DD-YYYY");
// Using moment for 5 day forecast date values instead of the API call so they all format the same //
var ForecastDayOne = moment().add(1,'days').format("MM-DD-YYYY");
var ForecastDayTwo = moment().add(2,'days').format("MM-DD-YYYY");
var ForecastDayThree = moment().add(3,'days').format("MM-DD-YYYY");
var ForecastDayFour = moment().add(4,'days').format("MM-DD-YYYY");
var ForecastDayFive = moment().add(5,'days').format("MM-DD-YYYY");

var currentLat;
var currentLong;
var citySearch;
// Stores cityList in localStorage //
function storeSearches() {
    localStorage.setItem("cities", JSON.stringify(cityList));
};

// Adds last searched city to list-group as button for user to select city //
function createSearchedCityList(){
    $(".grid").empty();
    for (var i = 0; i < cityList.length; i++) {
        $(".grid").append($(`<button class=" cityBtn bg-blue-300 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"> ${cityList[i]} </button>`).attr("id", i));
    }
};

// Event listener for city search evokes above functions to dynamically display results //
$("form").on("submit", function(event) {
    event.preventDefault();
    var newCity = $("#city").val().trim();
    cityList.unshift(newCity);
    $("#city").val("");
    $("#weatherToday").empty();
    storeSearches();
    createSearchedCityList();
    displayPageElements();
});

// Main function that dynamically creates and appends all the API data to the HTML with 3 calls //
function displayPageElements(cityParam) {
    // Since we are unshifting to the array every sumbit would be a new city at index 0 //
    if(cityParam) {
        citySearch = cityParam;
    } else {
        citySearch = cityList[0];
    }
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=Imperial" + "&appid=" + APIKey;
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        currentLat = data.coord.lat;
        currentLong = data.coord.lon;
        $("#weatherToday").empty();
        $("#weatherToday").append(
            `<div class="container" id="currentDayForecast>
                <h3 class="">${citySearch}</h3>
                <h3 class="">${currentDay}</h3>
                <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                <p>Temperature: ${data.main.temp} &degF</p>
                <p>Wind: ${data.wind.speed} mph</p>
                <p>Humidity: ${data.main.humidity} %</p>
            </div>`
        );

        // Query to obtain and append UV Index data to today's forecast //
        var queryUVI = "https://api.openweathermap.org/data/2.5/onecall?" + "lat=" + currentLat + "&lon=" + currentLong + "&exclude=hourly,daily" + "&appid=" + APIKey;
        fetch(queryUVI)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            $("#weatherToday").append(`<p id="uvValue">UV Index: ${data.current.uvi}</p>`);
            // If statement to reflect severity of the current UV Index value via different background colors//
            if (data.current.uvi >= 3) {
                $("#uvValue").removeClass();
                $("#uvValue").addClass('uvValueModerate');
            } else if (data.current.uvi >= 6) {
                $("#uvValue").removeClass();
                $("#uvValue").addClass(".uvValueHigh");
            } else if (data.current.uvi >= 9) {
                $("#uvValue").removeClass();
                $("#uvValue").addClass(".uvValueExtreme");
            }
        })
        // Query to obtain 5 day forecast data from target API //
        var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?" + "lat=" + currentLat + "&lon=" + currentLong + "&exclude=hourly,daily" + "&units=imperial" + "&appid=" + APIKey;
        fetch(queryForecast)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
            console.log(data);
            // Clearing elements prior to each search to avoid data duplication //
            $("#forecastDate1").empty();
            $("#forecastDate2").empty();
            $("#forecastDate3").empty();
            $("#forecastDate4").empty();
            $("#forecastDate5").empty();
            // Chosen list array value for each day correlates with 12:00pm //
            // Appending forecast data for day 1/5 //
            $("#forecastDate1").append(`<p>${ForecastDayOne}</p>`);
            $("#forecastDate1").append(`<div class="container"><img src="https://openweathermap.org/img/w/${data.list[5].weather[0].icon}.png"></div>`);
            $("#forecastDate1").append(`<p>Temp: ${data.list[5].main.temp} &degF</p>`);
            $("#forecastDate1").append(`<p>Wind: ${data.list[5].wind.speed} mph</p>`);
            $("#forecastDate1").append(`<p>Humidity: ${data.list[5].main.humidity} %</p>`);
            // Appending forecast data for day 2/5 //
            $("#forecastDate2").append(`<p>${ForecastDayTwo}</p>`);
            $("#forecastDate2").append(`<div class="container"><img src="https://openweathermap.org/img/w/${data.list[13].weather[0].icon}.png"></div>`);
            $("#forecastDate2").append(`<p>Temp: ${data.list[13].main.temp} &degF</p>`);
            $("#forecastDate2").append(`<p>Wind: ${data.list[13].wind.speed} mph</p>`);
            $("#forecastDate2").append(`<p>Humidity: ${data.list[13].main.humidity} %</p>`);
            // Appending forecast data for day 3/5 //
            $("#forecastDate3").append(`<p>${ForecastDayThree}</p>`);
            $("#forecastDate3").append(`<div class="container"><img src="https://openweathermap.org/img/w/${data.list[21].weather[0].icon}.png"></div>`);
            $("#forecastDate3").append(`<p>Temp: ${data.list[21].main.temp} &degF</p>`);
            $("#forecastDate3").append(`<p>Wind: ${data.list[21].wind.speed} mph</p>`);
            $("#forecastDate3").append(`<p>Humidity: ${data.list[21].main.humidity} %</p>`);
            // Appending forecast data for day 4/5 //
            $("#forecastDate4").append(`<p>${ForecastDayFour}</p>`);
            $("#forecastDate4").append(`<div class="container"><img src="https://openweathermap.org/img/w/${data.list[29].weather[0].icon}.png"></div>`);
            $("#forecastDate4").append(`<p>Temp: ${data.list[29].main.temp} &degF</p>`);
            $("#forecastDate4").append(`<p>Wind: ${data.list[29].wind.speed} mph</p>`);
            $("#forecastDate4").append(`<p>Humidity: ${data.list[29].main.humidity} %</p>`);
            // Appending forecast data for day 5/5 //
            $("#forecastDate5").append(`<p>${ForecastDayFive}</p>`);
            $("#forecastDate5").append(`<div class="container"><img src="https://openweathermap.org/img/w/${data.list[37].weather[0].icon}.png"></div>`);
            $("#forecastDate5").append(`<p>Temp: ${data.list[37].main.temp} &degF</p>`);
            $("#forecastDate5").append(`<p>Wind: ${data.list[37].wind.speed} mph</p>`);
            $("#forecastDate5").append(`<p>Humidity: ${data.list[37].main.humidity} %</p>`);
        })
      });
    
    // Event listeners for recently searched cities //
    $("#0").on("click", function(event) {
        event.preventDefault();
        console.log("Button pressed!");
        cityParam = cityList[0]
        displayPageElements(cityParam);
    });

    $("#1").on("click", function(event) {
        $("#currentDayForecast").empty();
        event.preventDefault();
        cityParam = cityList[1]
        displayPageElements(cityParam);
    });

    $("#2").on("click", function(event) {
        $("#currentDayForecast").empty();
        event.preventDefault();
        console.log("Button pressed!");
        cityParam = cityList[2]
        displayPageElements(cityParam);
    });

    $("#3").on("click", function(event) {
        event.preventDefault();
        console.log("Button pressed!");
        cityParam = cityList[3]
        displayPageElements(cityParam);
    });

    $("#4").on("click", function(event) {
        $("#currentDayForecast").empty();
        event.preventDefault();
        cityParam = cityList[4]
        displayPageElements(cityParam);
    });

    $("#5").on("click", function(event) {
        $("#currentDayForecast").empty();
        event.preventDefault();
        console.log("Button pressed!");
        cityParam = cityList[5]
        displayPageElements(cityParam);
    });
  };