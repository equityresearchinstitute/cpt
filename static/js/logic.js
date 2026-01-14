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
        center: [37.79949, -122.283399], //adding in default location the map opens to here
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

        const tr = document.createElement("tr"); //creating a row for the table and pulling in data from properties data in sampleparcels.js below
        tr.innerHTML = `
        <td>${p.address}</td> 
        <td>${p.apn}</td>
        <td>${p.landUseCode}</td>
        <td>${p.assessedTotalValue}</td>
        <td>${p.assessedLandValue}</td>
        <td>${p.assessedImprovementValue}</td>
        <td>${p.saleDate}</td>
        <td>${p.saleAmount}</td>
        <td>${p.totalLandSQFT}</td>
        <td>${p.yearBuilt}</td>
        <td>${p.totalAreaSQFTAllBuildings}</td>
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
            f => (f.properties?.apn || "")== apn
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
        const apn = p.apn || "";

        const col1= `
          ${section("Property")}
          ${kv("Address:", p.address)}
          ${kv("County:", p.county)}
          ${kv("APN:", apn)}
          ${section("Characteristics")}
          ${kv("Land Use Code:", p.landUseCode)}
          ${kv("Land Use:", p.landUseDescription)}
          ${kv("Year Built:", p.yearBuilt)}
          ${kv("Effective Year Built:", p.effectiveYearBuilt)}
          ${kv("Property Indicator Code:", p.property_indicator_code_v3)}
          ${kv("Number of Buildings:", p.number_of_buildings_v3)}
          ${kv("Total Land SQFT:", p.totalLandSQFT)}
          ${kv("Total Area SQFT All Buildings:", p.TotalAreaSQFTAllBuildings)}
          ${kv("Improvements:", p.improvements)}
          ${kv("Net Improvement Value", p.netImprovementValue)}

        `;

        const col2= `
          ${section("Assessed Value")}
          ${kv("Assessed Total Value:", p.assessedTotalValue)}
          ${kv("Assessed Land Value:", p.assessedLandValue)}
          ${kv("Assessed Improvement Value", p.assessedImprovementValue)}
          ${section("Ownership and Mailing")}
          ${kv("Owner One:", p.ownerOneName)}
          ${kv("Owner Mailing Address:", p.ownerOneMailingAddress)}
          ${kv("Corporate Owner:", p.owner_one_corporate_indicator)}
          ${kv("Owner Two:", p.ownerTwoName)}
          ${kv("Owner Mailing Address", p.ownerTwoMailingAddress)}
          ${kv("Corporate Owner:", p.owner_two_corporate_indicator)}

          ${section("Sales and Transaction History")}
          ${kv("Sale Type:", p.saleTypeCode)}
          ${kv("Sale Amount:", p.saleAmount)}
          ${kv("Sale Date:", p.saleDate)}
          ${kv("Recording Date:", p.recordingDate)}
          ${kv("Seller Name", p.sellerName)}
          ${kv("Document Type:", p.saleDocumentType)}
          ${kv("Document:", p.document)}
          ${kv("Assessor Web Link:", p.weblink)}               
        `;
        
        const col3=`

          ${section("Taxable Value & Taxes")}
          ${kv("Tax Year:", p.taxYear)}
          ${kv("Tax Amount:", p.taxAmount)}
          ${kv("Taxable Improvement Value:", p.taxableImprovementValue)} 
          ${kv("Taxable Land Value:", p.taxableLandValue)}
          ${kv("Net Taxable Amount:", p.netTaxableAmount)}

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


      /*-----------------------------------------------------------------------------------*/
      /* Parcel Layer */
      /*-----------------------------------------------------------------------------------*/
 
// Create a custom info panel
const infoPanel = document.createElement('div');
infoPanel.className = 'infoPanel hidden';
document.getElementById('map').appendChild(infoPanel);

export function createParcelsLayer(L, geojson, options = {}) {
  let layerRef;
  layerRef = L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => {
      // Create a circle marker for each point
      return L.circleMarker(latlng, {
        radius: 6,
        fillColor: "#3388ff",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties || {};

      layer.on("mouseover", (e) => {
        e.target.setStyle({
          radius: 8,
          fillColor: "#ff7800",
          fillOpacity: 0.9
        });
        if (e.target.bringToFront) e.target.bringToFront();
      });

      layer.on("mouseout", (e) => {
        e.target.setStyle({
          radius: 6,
          fillColor: "#3388ff",
          fillOpacity: 0.7
        });
      });

      // Show info panel on click
      layer.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        infoPanel.innerHTML = buildParcelTooltipHTML(p) + 
          '<button id="close-panel" style="position: absolute; top: 10px; right: 10px; background: #ddd; border: none; border-radius: 4px; padding: 8px 12px; cursor: pointer; font-weight: bold;">✕</button>';
        infoPanel.classList.remove('hidden');
        
        // Add close button listener
        document.getElementById('close-panel').addEventListener('click', () => {
          infoPanel.classList.add('hidden');
        });
      });
    }
  });

  return layerRef;
}

const parcelsLayer = createParcelsLayer(L, sampleParcels).addTo(myMap);

// Close panel when clicking on map
myMap.on('click', () => {
  infoPanel.classList.add('hidden');
});

console.log("features:", sampleParcels.features?.length);
console.log("layers created:", parcelsLayer.getLayers().length);
console.log("bounds valid:", parcelsLayer.getBounds().isValid());
const bounds = parcelsLayer.getBounds();
if (bounds.isValid()) myMap.fitBounds(parcelsLayer.getBounds(), { maxZoom: 18 });