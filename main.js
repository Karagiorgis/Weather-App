 var app = new Vue({
   el: "#app",
   data: {
     info: [],
     data: [],
     mainData: {},
     weekObj: {},
     wholeDay: [],
     nextDays: [],
     nextDays1: [],
     nextDays2: [],
     slide1: [],
     slide2: [],
     slide3: [],
     page: 'home'
   },

   methods: {

     searchCity: function () {
       var input = document.getElementById("search");
       var value = input.value;
       input.addEventListener("keyup", function (event) {
         if (event.keyCode === 13) {
           event.preventDefault();
           app.getData(value);
           document.getElementById("sbtn").click();
         }
       });
       app.getData(value);
     },

     getData: function (inputCity) {
       if (inputCity.length == 0) {
         var text = document.getElementById("err");
         text.innerHTML = "* Please search for a correct city!";
       } else {
         
         fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + inputCity + '&APPID=013e94b7065991843e6435dd41005e59')
           .then(response => response.json())
           .then(json => {
             app.info = json;
             app.data = json.list;
             if (app.data.length > 0) {
               app.getInfo();
               app.getWeek();
               app.getWholeDay();
               app.getNextDays();
               app.splitArr();
             }
           })
           .catch(error => console.log("error", error))

       }
     },


     splitArr: function () {
       var array = app.wholeDay;


       function chunkArray(myArray, chunk_size) {
         let results = [];

         while (myArray.length) {
           results.push(myArray.splice(0, chunk_size))
         }

         return results;
       }

       array = chunkArray(array, 3);


       app.nextDays = chunkArray(app.nextDays, 3);
       app.nextDays1 = app.nextDays[0];
       app.nextDays2 = app.nextDays[1];

       app.slide1 = array[0];
       app.slide2 = array[1];
       app.slide3 = array[2];

     },


     getInfo: function () {
       
       var information = this.data;
       var obj = this.mainData;
       var city = this.info.city.name;
       var country = this.info.city.country;
       var date = new Date(information[0].dt_txt).toString();
       var weekDay = this.setWeekDay(date.split(" ")[0]);
       var month = date.split(" ")[1] + " " + date.split(" ")[2]
       var year = date.split(" ")[3]
       var day = weekDay + " " + month + " " + year;
       
       obj["city"] = city;
       obj["country"] = country;
       obj["date"] = day;
       obj["temp"] = (information[0].main.temp - 273.15).toString().split(".")[0];
       obj["maxTemp"] = (information[0].main.temp_max - 273.15).toString().split(".")[0];
       obj["minTemp"] = (information[0].main.temp_min - 273.15).toString().split(".")[0];
       obj["humidity"] = information[0].main.humidity;
       obj["description"] = information[0].weather[0].description;
       obj["wind"] = information[0].wind.speed;
       obj["weather"] = this.setWeatherIcon(information[0].weather[0].main);
       
     },

     setWeekDay: function (day) {

       var weekDay;

       if (day == "Mon") {
         weekDay = "Monday"
       } else if (day == "Tue") {
         weekDay = "Tuesday"
       } else if (day == "Wed") {
         weekDay = "Wednesday"
       } else if (day == "Thu") {
         weekDay = "Thursday"
       } else if (day == "Fri") {
         weekDay = "Friday"
       } else if (day == "Sat") {
         weekDay = "Saturday"
       } else {
         weekDay = "Sunday"
       }
       return weekDay;
     },

     setWeatherIcon: function (weather) {
       var icon;
       
       if (weather == "Rain") {
         icon = "images/icons/rain.png";
       }
       if (weather == "Clouds") {
         icon = "images/icons/cloud.png";
       }
       if (weather == "Snow") {
         icon = "images/icons/snow.png"
       }
       if (weather == "Clear") {
         icon = "images/icons/sun.png"
       }
       return icon;
     },

     getWeek: function () {
       
       const list = this.data;
       
       var everyDay = {};
       var days = [];
       for (let i = 0; i < list.length; i++) {
         var dates = new Date(list[i].dt_txt).toString();
         var day = dates.split(" ")[0];
         if (!everyDay[day]) {
           everyDay[day] = []
         }
         if (Object.keys(everyDay).includes(day)) {
           everyDay[day].push(list[i])
         }
       }
       app.weekObj = everyDay;
     },

     getWholeDay: function () {
       
       var list = this.data;
       var next24Hours = [];
       for (let i = 0; i < 9; i++) {
         var dateObject = {};
         var weather = list[i].weather[0].main;
         dateObject["time"] = (list[i].dt_txt).split(" ")[1];
         dateObject["icon"] = this.setWeatherIcon(weather);
         dateObject["temp"] = (list[i].main.temp - 273.15).toString().split(".")[0];
         dateObject["maxTemp"] = (list[i].main.temp_max - 273.15).toString().split(".")[0];
         dateObject["minTemp"] = (list[i].main.temp_min - 273.15).toString().split(".")[0];
         dateObject["wind"] = list[i].wind.speed;
         dateObject["humidity"] = list[i].main.humidity;
         next24Hours.push(dateObject);
       }
       app.wholeDay = next24Hours;
       
     },

     getNextDays: function () {
       
       const nextDaysObject = this.weekObj;
       const nextDays = [];
       for (key in nextDaysObject) {
         const eachDay = nextDaysObject[key];
         let day = this.setWeekDay(key);
         let weather = this.setWeatherIcon(eachDay[0].weather[0].main);
         var date = eachDay[0].dt_txt.toString().split(" ")[0];
         date = date.toString().split("-").sort().join("-");
         let avgTemp = 0;
         let avgMaxTemp = 0;
         let avgMinTemp = 0;
         let avgHumidity = 0;
         let avgWind = 0; for (var i = 0; i < eachDay.length; i++) {
           avgTemp += parseFloat(eachDay[i].main.temp - 273.15);
           avgMaxTemp += parseFloat(eachDay[i].main.temp_max - 273.15);
           avgMinTemp += parseFloat(eachDay[i].main.temp_min - 273.15);
           avgHumidity += eachDay[i].main.humidity;
           avgWind += eachDay[i].wind.speed;
         }
         let object = {
           day: day,
           date: date,
           weather: weather,
           avgTemp: (avgTemp / i).toString().split(".")[0],
           avgMaxTemp: (avgMaxTemp / i).toString().split(".")[0],
           avgMinTemp: (avgMinTemp / i).toString().split(".")[0],
           avgHumidity: (avgHumidity / i).toString().split(".")[0],
           avgWind: (avgHumidity / i).toString().split(".")[0]
         };
         nextDays.push(object);
         app.nextDays = nextDays;
       }
     },

     goBack: function () {
       
       if (app.page == "weather") {
         app.page = "home";
         app.info = [];
         app.date = [];
         
       }
     }

   }

 })


