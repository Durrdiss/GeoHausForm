/**
 * Created by InterEng on 8/12/2016.
 */
var templateUrl = templateDir;
var placeID;
var place = jQuery("#suburbLocation");
var distance = jQuery("#location");

var geocoder;
var mainLatLng = ["-31.7450","115.7661"];
var distanceLimits = [0,10,20,30,40,50];

jQuery(document).ready(function(){

    distance.parent().parent().hide();


    if(place != null){
        jQuery.getJSON(templateUrl + "/data/suburbs.json", function( data ) {
            jQuery.each(data,function(value, suburb)
            {
                place.append(jQuery('<option></option>', {
                    value: suburb.VALUE,
                    text : suburb.LOCATION + ', ' + suburb.POSTCODE
                }));
            });
        });
    }
});

//called by the Google Maps API
function initMap(){
    geocoder = new google.maps.Geocoder();
}

//when a suburb is chosen
place.on('change',function(){
    distanceCalc(place.find("option:selected").text() + ", WA, Australia");
});

//calculates distance!
function distanceCalc(address){
    console.log(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            var latLng = results[0].geometry.location;

            var R = 6371; // km
            var RAD = Math.PI/180;
            var dLat = (latLng.lat()-mainLatLng[0])*RAD;
            var dLon = (latLng.lng()-mainLatLng[1])*RAD;
            var lat1 = mainLatLng[0]*RAD;
            var lat2 = latLng.lat()*RAD;

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            for(var i=0;i<distanceLimits.length;i++){
                if( d == 0){
                    placeID = 1;
                    break;
                } else if(distanceLimits[i] < d && d <= distanceLimits[i+1]){
                    placeID = i+1;
                    break;
                }
            }
            console.log("ID = " + placeID + ", d = " + d);
            distance.val(placeID);
            distance.trigger('change');

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}