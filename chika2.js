var code2count_all = [];
var code2count_school = [];
var code2count = [];
var school_exist=[];
var circleMarkerOptions = {
    radius: 5,
    color: '#ff0000'
};
var circleMarkerOptions2 = {
   radius: 5,
   color: '#0000ff'
};

function meshPopup(feature,layer){
  //console.log(feature.properties.MESH_ID);
  var mesh_id = feature.properties.MESH_ID;
  var city_code = feature.properties.SHICODE;
  var content = mesh_id+":"+city_code;
  layer.bindPopup(content);

};

function newPopup(layer){
  var mesh_id = layer.feature.properties.MESH_ID;
  var city_code = layer.feature.properties.SHICODE;
  var count = code2count[mesh_id];
  var content = mesh_id+":"+city_code + ":" + count;
  return content;
};



function schoolPoint(feature,latlng){
 
   var name = feature.name;
   var jusho = feature.adress;
   var mesh_id = getMeshId(latlng);
   //console.log(latlng);
   var content = name + ":<br>"+jusho+":<br>meshID:"+ mesh_id;
   
   x = L.circleMarker(latlng,circleMarkerOptions2).bindPopup(content);
   return x;
};

function chikaPoint(feature,latlng){
   var kakaku=feature.price;
   var name = feature.adress;
  var sum=feature.sum_InMesh;
   var mesh_id = getMeshId(latlng);
   //console.log(latlng);
   var content = name + ":<br>"   +kakaku+"円/m2:<br>meshID:"+ mesh_id+":<br>メッシュ内の学校の数:"+sum+"校";
  

   x = L.circleMarker(latlng,circleMarkerOptions).bindPopup(content);
   return x;

};


function newStyle_1 (feature){
    var mesh_id = feature.properties.MESH_ID;
    var count = code2count_school[mesh_id];
    return {
       fillColor: color(count),
       weight: 1,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.5
    };
}

function newStyle_2 (feature){
    var mesh_id = feature.properties.MESH_ID;
    var count = code2count_all[mesh_id];
    count = count/10;
    return {
       fillColor: color(count),
       weight: 1,
       opacity: 1,
       color: 'white',
       fillOpacity: 0.5
    };
}

function orgStyle(feature){
   return {fillColor:'#3388ff'
   };
}



function getMeshId(latlng){
   var lat = latlng.lat;
   var lng = latlng.lng;
   var first = Math.floor(lat*60/40);
   var first_2 = Math.floor(lng - 100);
   var first_2_rest = lng - 100 - first_2;
   var first_rest = lat*60%40;
   var second = Math.floor(first_rest/5);
   var second_2 = Math.floor(first_2_rest*60/7.5);
   var second_rest = first_rest%5;
   var second_2_rest = (first_2_rest*60)%7.5;
   var third = Math.floor(second_rest*2);
   var third_2 = Math.floor(second_2_rest*60/45);
      //console.log(first+":"+first_2+":"+second+":"+second_2+":"+third+":"+third_2+":"+mesh_id);
   var mesh_id = first.toString()+first_2.toString()+second.toString()+second_2.toString()+third.toString()+third_2.toString();
   return mesh_id;
};

function count_1(feature,layer){
  var lat_lng = feature.geometry.coordinates;
  var latlng = L.latLng(lat_lng[1], lat_lng[0]);
  var mesh_id = getMeshId(latlng);
  if (!code2count_all[mesh_id]){
     code2count_all[mesh_id] = 1;
  }
  else {
     code2count_all[mesh_id]++;
  }
};

function count_2(feature,layer){
  var lat_lng = feature.geometry.coordinates;
  var latlng = L.latLng(lat_lng[1], lat_lng[0]);
  var mesh_id = getMeshId(latlng);
  if (!code2count_school[mesh_id]){
     code2count_school[mesh_id] = 1;
  }
  else {
     code2count_school[mesh_id]++;
  }
};

function color(x){
   return x > 10  ? '#990000' :
   x >  8        ? '#d7301f' :
   x >  6        ? '#ef6548' :
   x >  4        ? '#fc8d59' :
   x >  2       ? '#fdbb84' :
   x >  1        ? '#fdd49e' :
   x >  0        ? '#fee8c8' : '#fff7ec';
}

//======================================================================
// Main function
//======================================================================
jQuery(document.body).ready(function($){
var latlng = [35.6920, 140.0486];
var map = L.map('map', 
{
     center: latlng, 
     zoom: 10,
     preferCanvas: true
});
 
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
var popLayer = L.geoJson(tokyoMesh, {
   onEachFeature: meshPopup
});
popLayer.addTo(map);

var chikaLayer = L.geoJson(chika_data4,{
    pointToLayer: chikaPoint,
    onEachFeature: count_1
});
var schoolLayer = L.geoJson(schools_Tokyo,{
   
   pointToLayer: schoolPoint,
   onEachFeature: count_1
});

$("#chika_school").on('click',function(){
   code2count = code2count_school;
   
   chikaLayer.addTo(map);
   popLayer.bindPopup(newPopup).setStyle(newStyle_1);
   schoolLayer.addTo(map);
   popLayer.bindPopup(newPopup).setStyle(newStyle_2);
});
$("#chika").on('click',function(){
    code2count = code2count_school;
    map.removeLayer(schoolLayer);
    chikaLayer.addTo(map);
    popLayer.bindPopup(newPopup).setStyle(newStyle_1);
});

$("#school").on('click',function(){
   code2count = code2count_school;
   map.removeLayer(chikaLayer);
   schoolLayer.addTo(map);
   popLayer.bindPopup(newPopup).setStyle(newStyle_2);
});






$("#off_button").on('click', function(){
    map.removeLayer(schoolLayer);
    map.removeLayer(chikaLayer);
});

 
// Do not forget to close the brackets
});             
