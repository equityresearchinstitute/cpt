//File name: logic.js
//Author: Arpita Sharma
// Date Created: 1/05/2026
//Date Modified: 1/08/2025
//Purpose: To bring in the basemap street layer and parcels, and create a box at the bottom of the website where selected properties show up in a table and can be exported as an Excel workbook
/*-----------------------------------------------------------------------------------*/

// Importing the sample parcels I created to add to the website here.
import { sampleParcels } from './sample_parcels.js';

/*-----------------------------------------------------------------------------------*/
/*Small helpers to clean the data*/
/*-----------------------------------------------------------------------------------*/

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/*-----------------------------------------------------------------------------------*/
/* Map Setup */
/*-----------------------------------------------------------------------------------*/

// Create the base map layer here.
const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19 // adding the max zoom layer for the base map
});

      // Create our map, giving it the streetmap layer to display on load. 
      const myMap = L.map("map", {
        center: [34.0521, -118.2454], //adding in default location the map opens to here
        zoom: 18, // adding the default zoom when map opens here
        maxZoom: 19 // this i the max zoom length that anyone can zoom down to
      });

      street.addTo(myMap); //adding the street layer to the map
      setTimeout(() => myMap.invalidateSize(), 0); 

      /*-----------------------------------------------------------------------------------*/
      /* Table References */
      /*-----------------------------------------------------------------------------------*/

      const tbody = document.getElementById("selectedTableBody"); // creating tbody reference which finds the HTML element with the ID selectedTableBody, and keep a permanent reference to it so I can use it later
      const parcels = sampleParcels.features; // creating parcels reference which imports features from sampleParcels.js

      let dummyCount = 0; // setting dummyCount reference to 0

      /*-----------------------------------------------------------------------------------*/
      /* Adding a Row */
      /*-----------------------------------------------------------------------------------*/

      function addRow(feature) {
        if (!tbody) {
          console.warn("Table body #selectdTableBody not found.");
          return;
        }

        const empty = tbody.querySelector(".empty-row"); // creating empty reference whenever tbody querySelector has an empty row
        if (empty) empty.remove(); // if the row is empty, remove the row

        const p = feature.properties || {};
        const pv = p.propertyValue || {};
        const av = p.assessedValue || {};
        const pc = p.propertyCharacteristics || {};
        const tvat = p.taxableValueandTaxes || {};
        const sath = p.salesAndTransactionHistory || {};

        const tr = document.createElement("tr"); //creating a row for the table and pulling in data from properties data in sampleparcels.js below
        tr.innerHTML = `
        <td>${p.address}</td> 
        <td>${pv.valuePerSQFT}</td>
        <td>${pv.taxValue}</td>
        <td>${pv.taxAmount}</td>
        <td>${av.assessedPropertyValue}</td>
        <td>${av.assessedLandValue}</td>
        <td>${pc.buildingSQFT}</td>
        <td>${pc.landSQFT}</td>
        <td>${av.assessedPropertyValueSQFT}</td>
        <td>${av.assessedLandValueSQFT}</td>
        <td>${tvat.baseYear}</td>
        <td>${sath.saleDate}</td>
        `;
        tbody.appendChild(tr); //adding these rows to the table

      }

      /*-----------------------------------------------------------------------------------*/
      /* Tooltip compare clicks (dynamic) */
      /*-----------------------------------------------------------------------------------*/

        //Handle cliks on dynamically-created tooltip Compare buttons 
        document.addEventListener("click", (e) => {
          const btn = e.target.closest(".pt-compare");
          if (!btn) return;

          const apn=btn.dataset.apn ||"";
          const feature = parcels.find(
            f => (f.properties?.referenceAndVerification?.apn || "")== apn
          );
          
          if (!feature) {
            console.warn("Could not find feature for APN:", apn);
            return;
          }

          addRow(feature); // add the feature to the bottom table
        });
      
      /*-----------------------------------------------------------------------------------*/
      /* Tooltip HTML and Styles */
      /*-----------------------------------------------------------------------------------*/

      function kv(label, value) {
        if (value === undefined || value === null || value === "") return "";
        return `
          <div class="pt-kv">
            <div class="pt-label">${esc(label)}</div>
            <div class="pt-val">${esc(value)}</div>
          </div>
        `;  
      }

      function section(title) {
        return ` 
          <div class="pt-section-title">${esc(title)}</div>
        `;
      }

      function buildParcelTooltipHTML(p) { //this is a function to create a mouseover showing the values we want.
        const pv = p.propertyValue || {};
        const pc = p.propertyCharacteristics || {};
        const onm = p.ownershipAndMailing || {};
        const sath = p.salesAndTransactionHistory || {};
        const rav = p.referenceAndVerification || {};
        const av = p.assessedValue || {};
        const tvat = p.taxableValueandTaxes || {};
        const apn = rav.apn || "";

        const col1= `
          ${section("Property")}
          ${kv("Address", p.address)}
          ${section("Value")}
          ${kv("Value/sq ft", pv.valuePerSQFT)}
          ${kv("Tax Value", pv.taxValue)}
          ${kv("Tax Amount", pv.taxAmount)}
          ${section("Characteristics")}
          ${kv("Land Use", pc.landUsePerSQFT)}
          ${kv("Use Code", pc.useCode)}
          ${kv("Acerage", pc.acerage)}
          ${kv("Building SQFT", pc.buildingSQFT)}
          ${kv("Land SQFT", pc.landSQFT)}
          ${kv("Improvements", pc.improvements)}
          ${kv("Net Improvement Value", pc.netImprovementValue)}
        `;

        const col2= `
          ${section("Ownership and Mailing")}
          ${kv("Owner", onm.ownerName)}
          ${kv("Owner Mailing Address", onm.ownerMailingAddress)}
          ${kv("Out-of-state Owner", onm.outofstateOwner)}
          ${section("Sales and Transaction History")}
          ${kv("Sale Price", sath.salePrice)}
          ${kv("Sale Date", sath.saleDate)}
          ${kv("Recording Date", sath.recordingDate)}
          ${kv("Seller Name", sath.sellerName)}
          ${kv("APN", rav.apn)}
          ${kv("Document", rav.document)}
          ${kv("Assessor Web Link", rav.weblink)}               
        `;
        
        const col3=`
          ${section("Assessed Value")}
          ${kv("Assessed Year", av.assessedYear)}
          ${kv("Assessed Property Value", av.assessedPropertyValue)}
          ${kv("Assessed Land Value", av.assessedLandValue)}
          ${kv("Assessed Property Value per SQFT", av.assessedPropertyValueSQFT)}
          ${kv("Assessed Land Value per SQFT", av.assessedLandValueSQFT)}
          ${kv("Assessed improvement Value", av.assessedImprovementValue)}
          ${section("Taxable Value & Taxes")}
          ${kv("Tax Year", tvat.taxYear)}
          ${kv("Taxable Land Value", tvat.taxableLandValue)}
          ${kv("Taxable Improvement Value", tvat.taxableImprovementValue)} 
          ${kv("Net Taxable Amount", tvat.netTaxableAmount)}
          ${kv("Tax amount", tvat.taxAmount)}
          <div class="pt-col-action">
              <button class="pt-compare" type="button" data-apn="${esc(apn)}">Compare</button>
          </div>
        `;

        return `
          <div class="pt">
            <div class="pt-cols">
              <div class="pt-col">${col1}</div>
              <div class="pt-col">${col2}</div>
              <div class="pt-col">${col3}</div>
            </div>
          </div>
        `;
      }


      function defaultParcelStyle() { // this is what a parcel shape looks like when it's not selected.
        return{ color: "#444", weight: 1, fillColor: "#4C8BF5", fillOpacity: 0.25};
      }

      function highlightParcelStyle() { // this is what a parcel shape looks like when we move over it.
        return{ color: "#444", weight: 2, fillColor: "$4C8BF5", fillOpacity: 0.25};
      }

      /*-----------------------------------------------------------------------------------*/
      /* Parcel Layer */
      /*-----------------------------------------------------------------------------------*/
      
      /*Create a leaflet GeoJSON layer for parcels*/


      // Create a custom info panel
      const infoPanel = document.createElement('div');
      infoPanel.className = 'infoPanel hidden'; // Use class name and start hidden
      document.getElementById('map').appendChild(infoPanel);

      export function createParcelsLayer (L, geojson, options = {}) {
        let layerRef;
        layerRef = L.geoJSON(geojson, {
          style: defaultParcelStyle,
          onEachFeature: (feature, layer) => {
            const p = feature.properties || {};

            layer.on("mouseover", (e) => { 
              e.target.setStyle(highlightParcelStyle());
              if (e.target.bringToFront) e.target.bringToFront();
            });

            layer.on("mouseout", (e) => {
              layerRef.resetStyle(e.target);
            });

            // Show info panel on click
            layer.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              infoPanel.innerHTML = buildParcelTooltipHTML(p) + 
                '<button id="close-panel" style="position: absolute; top: 10px; right: 10px; background: #ddd; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer; font-weight: bold;">✕</button>';
              infoPanel.classList.remove('hidden'); // Show the panel
              
              // Add close button listener
              document.getElementById('close-panel').addEventListener('click', () => {
                infoPanel.classList.add('hidden'); // Hide the panel
              });
            });
          }
        });

        return layerRef;
      }

      const parcelsLayer = createParcelsLayer(L, sampleParcels).addTo(myMap); // adding in parcel layer from the sample_parcels.js file and attaching this layer to the map, so it's drawn

      // Close panel when clicking on map
      myMap.on('click', () => {
        infoPanel.classList.add('hidden');
      });

      //getting an error here and testing what's wrong
      console.log("features:", sampleParcels.features?.length);
      console.log("layers created:", parcelsLayer.getLayers().length);
      console.log("bounds valid:", parcelsLayer.getBounds().isValid());
      const bounds = parcelsLayer.getBounds();
      if (bounds.isValid()) myMap.fitBounds(parcelsLayer.getBounds(), { maxZoom: 18 }); // pan and zoom so that this bounding box fits entirely inside the view, zoom is also needed here to fit the parcels, but never closer than 19.