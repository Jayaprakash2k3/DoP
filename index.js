async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
      center: { lat:12.967558013562913, lng:77.5622669834594  },
      zoom: 14,
      mapId: "4504f8b37365c3d0",
    });
    map.data.loadGeoJson("demo.json");

    map.data.setStyle({
        fillColor: "red",
        strokeWeight: 2,
    });

    map.data.addListener("addfeature", (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
        const properties = feature.getProperty("name");
        const lat = feature.getProperty("lat");
        const lng = feature.getProperty("lng");
        const priceTag = document.createElement("div");
        priceTag.className = "price-tag";
        priceTag.textContent = properties;
        const marker = new AdvancedMarkerElement({
          position: {lat:lat,lng:lng},
          map: null,
          content: priceTag // Use a property value as the marker title
        });
        
    map.addListener("zoom_changed", (event) => {

        const zoom = map.getZoom();
        if (zoom) {
          // Only show each marker above a certain zoom level.
          marker.map = zoom > 19 ? map : null;
        }
      });
      });
    map.data.addListener("click", (event) => {
        const payload = { lat:event.latLng.lat(), lng: event.latLng.lng()  };
        const url = new URL("http://127.0.0.1:5000/");
        Object.keys(payload).forEach((key) => url.searchParams.append(key, payload[key]));
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
           }         
           fetch(url, { 
             method: "GET",
               headers: headersList,
             
           }).then((response) => {
             return response.json();
           }).then((data) => {
               console.log(data);
               const feature = event.feature;
               const geometry = feature.getGeometry();
               const properties = feature.getProperty("name");
               const lat = event.latLng.lat();
               const lng = event.latLng.lng();
               const priceTag = document.createElement("div");
             priceTag.className = "price-tag";
             
               map.data.addListener("mouseout", (event) => {
                   marker.map = null;        
               })
             const geocoder = new google.maps.Geocoder();
             geocoder.geocode({ location: { lat: lat, lng: lng } }, (results, status) => {
            //  priceTag.style.backgroundColor = "red";
             priceTag.innerHTML = `<span style="font-size:12px;font-weight:bold;">${data.dac}</span>`+",<br><span style='font-size:12px;font-weight:bold;color:black'>"+
             results[0].formatted_address.replace(/,/g, "<br>")+"</span>";
             })
               
             const marker = new AdvancedMarkerElement({
              position: {lat:lat,lng:lng},
              map: map,
              content: priceTag // Use a property value as the marker title
            });
           })   
        
    })

    
       
    
    
    }
  
  initMap();