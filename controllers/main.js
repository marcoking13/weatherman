var path = require("path");
var axios = require("axios");
var weather_url = require("./../util/util.js").url;
var custom_url = require("./../util/util.js").customUrl;
var node_geocode = require("node-geocoder");
var Locations = require("./../data/locations.js");


var weather_data = {
  precipitationProbabilityAvg:0,
  windGustAvg:0,
  snowIntensityAvg:0,
  sleetIntensityAvg:0,
  dewPointAvg:0,
  cloudCoverAvg:0,
}

var forcast_weekly = [];

const options = {
  formatter:null,
  apiKey:"AIzaSyDT3CvnaTo7AnBgi4XRNHPrf0_hDTrF0EE"
}

const geocoder = node_geocode(options);

const GetMainPage = (req,res,next) =>{
  res.render(path.join(__dirname,"..","views","index.ejs"));
}


const PostWeatherData = async (req,res,next) => {

  var place = req.body.place;
  var latitude;
  var longitude;

  if(req.params == {} || !req.params){
    console.log("Not found");
    return;
  }

  const coords = await geocoder.geocode(place);

  if(coords.length > 0){

    latitude = coords[0].latitude;
    longitude = coords[0].longitude;
    var custom_endpoint = custom_url(latitude,longitude);

    axios.get(custom_endpoint).then((response)=>{

      var data = response.data;
      var forcast_weekly = [];
      var snapshot;

      for(var i = 0; i < data.timelines.daily.length; i++){

        var new_weather_data = {...weather_data};
        var today_weather_data = data.timelines.daily[i].values;

        new_weather_data.dewPointAvg = today_weather_data.dewPointAvg;
        new_weather_data.cloudCoverAvg = today_weather_data.cloudCoverAvg;
        new_weather_data.precipitationProbabilityAvg = today_weather_data.precipitationProbabilityAvg;
        new_weather_data.sleetIntensityAvg = today_weather_data.sleetIntensityAvg;
        new_weather_data.snowIntensityAvg = today_weather_data.snowIntensityAvg;
        new_weather_data.temperatureAvg = today_weather_data.temperatureAvg;
        new_weather_data.temperatureMin = today_weather_data.temperatureMin;
        new_weather_data.temperatureMax = today_weather_data.temperatureMax;
        new_weather_data.windGustAvg = today_weather_data.windGustAvg;

        if(i == 0){
          snapshot = new_weather_data;
        }

        forcast_weekly.push(new_weather_data);

      }

      var now = new Date();

      var data = {
        snapshot:today_weather_data,
        forcast_weekly:forcast_weekly,
        userID:"guest",
        location:{
          name:place,
          lat:latitude,
          lng:longitude
        },
        date: now,
        day:now.getDay()
      };

      var new_entry = new Locations(data);
      new_entry.save();

      return data;


    }).then((data)=>{
      console.log(data.day);
      res.json(data);
    }).catch((err)=>{console.log(err)})

  }


}

module.exports.GetMainPage = GetMainPage;
module.exports.PostWeatherData = PostWeatherData;
