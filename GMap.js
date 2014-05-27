/*
 * Google Map basic wrapper
 * GMap.js
 * @author: Elton Jain
 * twitter: @eltonjain
*/


// Google maps api
GMap = function(params){
	var _self = this;
	// new GMap
	// add marker (with content/infowindow)
	// bounds
	var site_url = location.protocol + '//' + location.hostname;
	_self.boundList = null;
	_self.infowindow = null;
	_self.infobox = null;
	_self.markerIcon = site_url + "/images/map-marker.png";
	_self.markerIconOrange = site_url + "/images/map-marker-orange.png";
	_self.map = null;
	_self.activeMarker = null;
	_self.isInfoBoxOpen = false;

	_self.settings = {
		lat: null,
		lng: null,
		map_canvas_id: 'map_canvas',
		zoom: 15,
		center:  new google.maps.LatLng(57.0442, 9.9116),
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: true,
		navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var o = $.extend(_self.settings, params);

	_self.infoBoxOptions = {
		closeBoxURL: "images/btn-close-big-sqr.png"
		/*,closeBoxMargin: "-20px 0 -20px 0"
		,pixelOffset: new google.maps.Size(-160, -550)
		,*/
		,isHidden: false
		,pane: "floatPane"
		,infoBoxClearance: new google.maps.Size(1, 1)
		,alignBottom: true
	}

	_self.init = function(){
		var latlng = new google.maps.LatLng(o.lat, o.lng);

		_self.map = new google.maps.Map(document.getElementById(o.map_canvas_id), o);
		_self.boundList = new google.maps.LatLngBounds();
		//_self.infowindow = new google.maps.InfoWindow();

	}
	_self.addMarker = function(lat,lng,content, W, H){
		var lat = lat.toString().replace(',','.');
		var lng = lng.toString().replace(',','.');
		var newPos = new google.maps.LatLng(lat, lng);

		var newMarker = new google.maps.Marker({
		  position: newPos,
		  map: _self.map,
		  icon: _self.markerIcon
		});

		if(typeof content !== "undefined"){
			google.maps.event.addListener(newMarker, 'click', function() {

			  // New infobox, set Pixel height width
			  if(typeof(H) !== "undefined" && typeof(W) !== "undefined") {
				_self.infoBoxOptions.pixelOffset = new google.maps.Size(-(W/2), -(H+70));
			  }

			  _self.infobox && _self.infobox.close();
			  if(_self.activeMarker) _self.activeMarker.setIcon(_self.markerIcon);

			   if (_self.isInfoBoxOpen && this == _self.activeMarker) { // close it
					_self.isInfoBoxOpen = false;
					_self.activeMarker = null;
				}
				else {
					// Active marker icon
					_self.infobox = new InfoBox(_self.infoBoxOptions);
					_self.infobox.setContent(content);
					_self.infobox.open(_self.map, newMarker);
					_self.isInfoBoxOpen = true;
					newMarker.setIcon(_self.markerIconOrange);
					_self.activeMarker = newMarker;
				}
			});
		}

		_self.boundList.extend(newPos);
	}
	_self.autoZoom = function(){
		_self.map.fitBounds(_self.boundList);
		_self.map.panToBounds(_self.boundList);
	}
	_self.changeZoom = function(zoom){
		// This is needed to set the zoom after fitbounds,
		google.maps.event.addListener(_self.map, 'zoom_changed', function() {
			zoomChangeBoundsListener =
				google.maps.event.addListener(_self.map, 'bounds_changed', function(event) {
					if (this.getZoom() > zoom && this.initialZoom == true) {
						// Change max/min zoom here
						this.setZoom(zoom);
						this.initialZoom = false;
					}
				google.maps.event.removeListener(zoomChangeBoundsListener);
			});
		});
		_self.map.initialZoom = true;
	}
}
