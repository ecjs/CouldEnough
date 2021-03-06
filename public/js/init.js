$(document).ready(function(){

  $("#yes").on("click", function(){
    getLocation();
  });

  $("#formsubmit").on("click", function(){
    $("#geolocate").html("");
    $("#form").fadeOut();
    getTemp( $("#city").val(), $("#state").val() );
    $("#geolocate").fadeIn();
  });

    $( "#city" ).autocomplete({
      source: function( request, response ) {
        $.ajax({
          url: "http://gd.geobytes.com/AutoCompleteCity",
          dataType: "jsonp",
          data: {
            q: request.term
          },
          success: function( data ) {
            response( data );
          }
        });
      },
      minLength: 3,
      select: function(event,ui){
        $.ajax({
url: "http://gd.geobytes.com/GetCityDetails",
dataType: "jsonp",
data: {
  fqcn: ui.item.label
},
success: function( data ) {
  $("#geolocate").html("");
  $("#form").fadeOut();
  getTemp(data.geobytescity,data.geobytescode);
  $("#geolocate").fadeIn();
}
        });
      }
    });

});

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showLocation);
  }
  else{
    console.log("geolocation is not supported!  Update to a modern browser.");
  }

}
function showLocation(p){
  $.ajax({
    url: 'http://localhost:3000/zip',
    type: 'POST',
    cache: 'FALSE',
    data: { lat: p.coords.latitude, long: p.coords.longitude},
    complete: function(){
      console.log('process complete');
    },
    success: function(data){
      getTemp(data.city,data.state);
      console.log("process success");
    },
    error: function(){
      console.log("process error");
    }
  });
}

function getTemp(c,s){
  $.ajax({
    url: 'http://localhost:3000/temperature',
    type: 'POST',
    cache: 'FALSE',
    data: { city: c, state: s},
    complete: function(){
      console.log('process complete');
    },
    success: function(data){
      if (data.temp <= 50){
        $("#introcold").html("Yes! Its currently " + data.temp + "F!  Go chill!");
      }
      else{
        $("#introcold").html("No, the current temp is " + data.temp + "F, it needs to be at least 50F!");
      }
    },
    error: function(){
      console.log("process error");
    }
  });
}
