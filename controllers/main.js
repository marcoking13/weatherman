var path = require("path");
var axios = require("axios");
var weather_url = require("./../util/util.js").url;
var custom_url = require("./../util/util.js").customUrl;
var node_geocode = require("node-geocoder");

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
  const coords = await geocoder.geocode(place);
  if(coords.length > 0){
    var {latitude,longitude} = coords[0];
    var custom_endpoint = custom_url(latitude,longitude);
    axios.get(custom_endpoint).then((response)=>{
      var data = response.data;
    }).catch((err)=>{console.log(err)})
  }
  
  res.redirect("/");
}

module.exports.GetMainPage = GetMainPage;
module.exports.PostWeatherData = PostWeatherData;
