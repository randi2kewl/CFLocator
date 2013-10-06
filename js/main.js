var reports;
var reportFreq;



$(document).ready(function()
{	
	//Initialize map at Georgia Tech's CULC building (location of first demo)
    var yourStartLatLng = new google.maps.LatLng(33.774358, -84.396463);
    $('#map_canvas').gmap({
        'center': yourStartLatLng,
        'zoom': 17
    });
    
    
    //Get reports every 20 seconds
    getReports();
    window.setInterval(getReports, 20000);
    
    
    //Ask user to report location
    $('#toast_report').fadeIn();
    $('#toast_report_yes').on('click', function()
    {
        startReporting();
        $('#toast_report').fadeOut();
    });
    $('#toast_report_no').on('click', function()
    {
        $('#toast_report').fadeOut();
    });  
    
    
    //Add refresh button
    $('#refresh').on('click', function()
    {
        getReports();
        $('#toast_refresh').fadeIn();
        setTimeout(function()
        {
            $('#toast_refresh').fadeOut();
        }, 1000);
    });
});



function getLocation()
{
    //Make sure user's browser can handle geolocation'
	if (navigator.geolocation)
	{
		navigator.geolocation.getCurrentPosition(posSuccessCallback, posErrorCallback, {timeout:8000});
	}
	else
	{
		alert("Geolocation is not supported by this browser.");
	}
}


function getReports()
{
    $.ajax({
        url: 'php/api.php',
        type: 'GET',
        success: function(data)
        {
            reports = $.parseJSON(data);
            console.log('Got reports:');
            console.log(reports);
            
            //Remove current markers, add markers from new reports
            $('#map_canvas').gmap('clear', 'markers');
            $.each(reports, function(i, report) 
            {
                //Determine color of pin: saturated -> pale ~= later -> earlier
                //There are 10 steps, so map the difference in time from now to 0-9
                var icon = new google.maps.MarkerImage(
                    "img/map-pins.png", 
                    new google.maps.Size(32, 32), 
                    new google.maps.Point(32*report.timeago, 0)
                );
                
                //Google Maps latlng object from report
                var position = new google.maps.LatLng(report.lat, report.lon);
                
                //Add markers for each report to map
                $('#map_canvas').gmap(
                    'addMarker', 
                    { 
                        'position': position,
                        'bounds': false,
                        'icon': icon
                    }
                );
            });
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error: ' + errorThrown);
        }
    });
}


function posErrorCallback(error) 
{
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
			console.log("The user prevented this page from retrieving the location.");
			break;

		case error.POSITION_UNAVAILABLE:
			console.log("The browser was unable to determine your location: " + error.message);
			break;

		case error.TIMEOUT:
			console.log("The browser timed out before retrieving the location.");
			break;

		case error.UNKNOWN_ERROR:
			console.log("There was an error while retrieving your location: " + error.message);
			break;
	}
}


function posSuccessCallback(position) 
{
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    
    putReport(lat, lon);
}


function putReport(lat, lon)
{
    $.ajax({
        url: 'php/api.php',
        data: {'lat': lat, 'lon': lon},
        type: 'POST',
        success: function(data)
        {
            console.log(data);
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error: ' + errorThrown);
        }
    });
}


function startReporting()
{
    getLocation();
    reportFreq = window.setInterval(getLocation, 20000);
    console.log('Started reporting every 20 seconds');
}


function stopReporting()
{
    window.clearInterval(reportFreq);
    console.log('Stopped reporting');
}

