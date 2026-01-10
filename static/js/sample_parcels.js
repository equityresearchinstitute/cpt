// Export of sample parcel polygons (fake rectangles) near downtown LA
export const sampleParcels = {
  "type": "FeatureCollection",
  "features": [
    {
    type: "Feature",
    properties: {
      address: "202 W 1st St, Los Angeles, CA 90012",

      propertyValue : {
        valuePerSQFT: "$24.17",
        taxValue: "$200,000",
        taxAmount: "$15,000",
      },
      propertyCharacteristics : {
        landUsePerSQFT: "Commercial Hotel",
        useCode: "Hospitality",
        acerage: "28",
        buildingSQFT: "10,000",
        landSQFT: "12,000",
        improvements: "$250,000",
        netImprovementValue: "$1,000,000",
      },
      ownershipAndMailing : {
        ownerName: "Ben Whitmore",
        ownerMailingAddress: "1234 Candycane Lane, Los Vegas, NV",
        outofstateOwner: "Yes",
      },
      salesAndTransactionHistory: {
        salePrice: "$150,000",
        saleDate: "1/25/2015",
        recordingDate: "2/1/2015",
        sellerMame: "Ben Handle",
      },
      referenceAndVerifcation : {
        apn:"5904",
        document: "410520",
        assessorWebLink: "https://eri.usc.edu", 
      },
      assessedValue: {
        assessedYear: "1955",
        assessedPropertyValue: "$200,000",
        assessedPropertyValueSQFT: "$20",
        assessedLandValueSQFT: "$4.17",
        assessedLandValue: "250,000",
        assessedImprovementValue: "$25,000",
     },
     taxableValueandTaxes: {
        baseYear: "2018",
        taxableLandValue : "$15,000",
        tabableImprovementValue: "$15,000",
        netTaxableAmount: "$10,000",
        taxAmount: "$10,000",
     },
    },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-118.2454578317168, 34.05212634446308],
        [-118.24584059597932, 34.05236947794213],
        [-118.24556309188928, 34.05267075106854],
        [-118.2460128398631, 34.05294295305685],
        [-118.2455407639757, 34.05342392919085],
        [-118.24472738998047, 34.0528715992221],
      ]]
    }
  }]
};

