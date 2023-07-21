async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const map = new Map(document.getElementById("map"), {
      center: { lat:12.98581214, lng:77.55544436 },
      zoom: 17,
      mapId: "4504f8b37365c3d0",
    });
    // map.data.loadGeoJson("demo.json");
   
    // const cords =[]
  var prev = null;
  fetch("http://localhost:5000/DAC").then((response) => {
    return response.json();
  }).then((data) => {
    data.forEach((element) => {
      const cords = []
      element.geometry.coordinates.forEach((cord) => {
        cord.forEach((cord) => {
          cords.push({ lat: cord[1], lng: cord[0] })
        })
      })
      
      const curr = new google.maps.Polygon({
        paths: cords,
        strokeColor: "#FF0000",
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0,
        dac: element.properties.name,
        lat: element.properties.lat,
        lng: element.properties.lng
      });
      curr.setMap(map);
      const priceTag = document.createElement("div");
      priceTag.className = "price-tag";
      priceTag.textContent = curr.dac;
      const marker = new AdvancedMarkerElement({
        position: { lat: curr.lat, lng: curr.lng },
        map: null,
        content: priceTag // Use a property value as the marker title
      });
      document.getElementById("showDAC").addEventListener("change", (event) => {
        marker.map = event.target.checked ? map : null;
      });
      document.getElementById("showBounding").addEventListener("change", (event) => {
        event.target.checked? curr.setOptions({ fillOpacity: 0.5, strokeOpacity: 0.5, editable: false, draggable: false }):curr.setOptions({ fillOpacity: 0, strokeOpacity: 0, editable: false, draggable: false });
        
      })
      curr.addListener("click", (event) => {
        if (prev != null) {
          prev.setOptions({ fillOpacity: 0, strokeOpacity: 0, editable: false, draggable: false });
          curr.setOptions({ fillOpacity: 0.5, strokeOpacity: 0.5, editable: true, draggable: true });
        } else {
          curr.setOptions({ fillOpacity: 0.5, strokeOpacity: 0.5, editable: true, draggable: true });
        }
        prev = curr;
      })

      // Construct the polygon.
    })
  });
    // console.log(cords);

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
        document.getElementById("showDAC").addEventListener("change", (event) => {
          marker.map = event.target.checked? map : null;
        });
    // map.addListener("zoom_changed", (event) => {

    //     const zoom = map.getZoom();
    //     if (zoom) {
    //       // Only show each marker above a certain zoom level.
    //       marker.map = zoom > 19 ? map : null;
    //     }
    //   });
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