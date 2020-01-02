function debounce(func, wait, immediate) {
  var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
};

var map;
var updateSize = debounce(function() {
  let metersPerPixel = 156543.03392 * Math.cos(map.center.lat() * Math.PI / 180) / Math.pow(2, map.zoom);
  let kmPerPixel = metersPerPixel / 1000.0;
  let kmWidthOfUk = 1078.0;
  let widthOfPic = (kmWidthOfUk * 1000) / metersPerPixel;
  widthOfPic = Math.floor(widthOfPic);
  let scale = widthOfPic / 200;
  document.getElementsByTagName("img")[0].style.transform = "scale(" + scale + ")";
}, 40);

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function initMap() {
  /*let url = new URL(window.location.href);
  let latFromUrlParam = url.searchParams.get("lat");
  let longFromUrlParam = url.searchParams.get("long");*/
  let latFromUrlParam = getUrlParameter("lat");
  let longFromUrlParam = getUrlParameter("long");
  latFromUrlParam = (latFromUrlParam) ? Number(latFromUrlParam) : 54.786826051560574;
  longFromUrlParam = (longFromUrlParam) ? Number(longFromUrlParam) : -4.255790353064472;
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: latFromUrlParam, lng: longFromUrlParam},
      zoom: 4, scaleControl: true,
      zoomControl: true,
      rotateControl: true,
      guestureHandling: 'cooperative',
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      streetViewControl: false
  });
  updateSize();
  map.addListener('center_changed', updateSize);
  map.addListener('zoom_changed', updateSize);
}
