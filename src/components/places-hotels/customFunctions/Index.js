import axios from "axios";
import data from "../../../data/data";
import { googleKey, yandexKey } from "./Credentials";
import GetDataFromHotel from "./GetDataFromHotel";
// google place
const fetchGooglePlace = async (place, inputFields) => {
  let googleCredentials = googleKey();
  var googlePlace = [];
  if (place) {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%${place}%&inputtype=textquery&region=at&fields=name,business_status,formatted_address,place_id,geometry&key=${googleCredentials}`
    );

    if (result.data.status !== "ZERO_RESULTS") {
      const fetchData = result.data.candidates[0];
      const placeId = fetchData.place_id;
      const address = fetchData.formatted_address;
      if (!placeId) {
        console.log("place id is not exist");
      } else {
        googlePlace = await fetchGooglePlaceDetail(
          placeId,
          inputFields,
          address,
          googleCredentials
        );
      }
    }
  }
  return await googlePlace;
};

// google place detail
const fetchGooglePlaceDetail = async (
  placeId,
  inputFields,
  address,
  googleCredentials
) => {
  let googleData = [];
  const result = await axios(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,international_phone_number&key=${googleCredentials}`
  );
  let name = result.data.result.name;
  let phoneStr = result.data.result.international_phone_number;
  let phone = phoneStr.replace(/\s/g, "");

  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    googleData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    googleData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    googleData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    googleData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    googleData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  }
  //console.log(googleData);
  return await googleData;
};

// openstreetmap
const fetchOpenPlaceDetail = async (place, inputFields) => {
  //let openCredentails=OpenKey();
  let openData = [];
  var name = "Record not found.";
  if (data) {
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags.name !== undefined
            ? i.tags.name === place
              ? (name = i.tags.name)
              : ""
            : ""}
        </li>
      );
    });
  }

  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }

    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[2].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: phoneData,
        address: addressData,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[2].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[2].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: phoneData,
        address: addressData,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    openData = [
      {
        name,
        phone: phoneData,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: "",
        address: addressData,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    openData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    let phoneData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["phone"] !== undefined ||
          i.tags["phone"] !== null ||
          i.tags["phone"] !== ""
            ? i.tags["phone"] === inputFields[1].object
              ? (phoneData = i.tags["phone"])
              : ""
            : i.tags["contact:phone"] !== undefined ||
              i.tags["contact:phone"] !== null ||
              i.tags["contact:phone"] !== ""
            ? i.tags["contact:phone"] === inputFields[1].object
              ? (phoneData = i.tags["contact:phone"])
              : ""
            : ""}
        </li>
      );
    });
    if (phoneData === "" || phoneData === null) {
      phoneData = "Record Not Found.";
    }
    openData = [
      {
        name,
        phone: phoneData,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    // address
    let addressData = "";
    data.map((i, index) => {
      return (
        <li key={index}>
          {i.tags["addr:street"] !== undefined ||
          i.tags["addr:street"] !== null ||
          i.tags["addr:street"] !== ""
            ? i.tags["addr:street"] === inputFields[1].object
              ? (addressData = i.tags["addr:street"])
              : ""
            : ""}
        </li>
      );
    });
    if (addressData === "" || addressData === null) {
      addressData = "Record Not Found.";
    }

    openData = [
      {
        name,
        phone: "",
        address: addressData,
      },
    ];
  }
  return await openData;
};

// yendax
const fetchYendaxPlaceDetail = async (place, inputFields) => {
  let yandexCredentails = yandexKey();
  const result = await axios(
    `https://search-maps.yandex.ru/v1/?text=${place}&bbox=13.3457347,47.6964719~13.36,47.91&type=biz&lang=en_us&apikey=${yandexCredentails}`
  );

  let name = result.data.features[0].properties.name;
  let phone = "Record not found";
  let address = "Record not found";
  if (result.data.features[0].properties.CompanyMetaData.Phones) {
    let phoneStr =
      result.data.features[0].properties.CompanyMetaData.Phones[0].formatted;
    phone = phoneStr.replace(/\s/g, "");
  }
  if (result.data.features[0].properties.CompanyMetaData.address) {
    address = result.data.features[0].properties.CompanyMetaData.address;
  }

  let yandexData = [];
  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    yandexData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    yandexData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    yandexData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    yandexData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    yandexData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    yandexData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    yandexData = [
      {
        name,
        phone: "",
        address: address,
      },
    ];
  }

  return yandexData;
};

// hotel
const fetchHotelPlaceDetail = async (place, inputFields) => {
  // endpoint url and query for hotel dataset
  const endpointUrlHotel =
    "http://172.16.44.133:7200/repositories/TirolGraph-Alpha";
  const sparqlQueryHotel = `PREFIX rdfs:<http://schema.org/>
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX dc:<http://purl.org/dc/terms/>select distinct ?name ?email ?url ?addressCountry ?addressRegion ?addressLocality ?streetAddress ?postalCode ?phone ?loc ?add ?contact
  where{
      ?s a rdfs:Hotel .
      ?s rdfs:name ?name .
      ?s rdfs:url ?url .
      ?s rdfs:email ?email .
      ?s rdfs:location ?loc .
      ?loc rdfs:address ?add .
      ?add rdfs:addressCountry ?addressCountry .
      ?add rdfs:addressRegion ?addressRegion .
      ?add rdfs:addressLocality ?addressLocality .
      ?add rdfs:streetAddress ?streetAddress .
      ?add rdfs:postalCode ?postalCode .
      ?s rdfs:contactPoint ?contact .
      ?contact rdfs:telephone ?phone .
     
      FILTER(lang(?name) = 'en') 
      FILTER regex(?name ,"${place}") .
  }
  `;

  const queryDispatcherHotel = new GetDataFromHotel(endpointUrlHotel);
  let hotelData = [];
  let name = "Record not found.";
  let phone = "Record not found.";
  let address = "Record not found.";
  //let url = "Record not found.";

  await queryDispatcherHotel.query(sparqlQueryHotel).then((res) => {
    if (res.results.bindings.length === 1) {
      name = res.results.bindings[0].name.value;
      phone = res.results.bindings[0].phone.value;
      address = res.results.bindings[0].streetAddress.value;
      //url = res.results.bindings[0].url.value;
    }
  });

  if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone" &&
    inputFields[2].predicate === "address"
  ) {
    hotelData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address" &&
    inputFields[2].predicate === "phone"
  ) {
    hotelData = [
      {
        name,
        phone,
        address,
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "phone"
  ) {
    hotelData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 2 &&
    inputFields[0].predicate === "name" &&
    inputFields[1].predicate === "address"
  ) {
    hotelData = [
      {
        name,
        phone: "",
        address,
      },
    ];
  } else if (inputFields.length === 1 && inputFields[0].predicate === "name") {
    hotelData = [
      {
        name,
        phone: "",
        address: "",
      },
    ];
  } else if (inputFields.length === 2 && inputFields[1].predicate === "phone") {
    hotelData = [
      {
        name,
        phone,
        address: "",
      },
    ];
  } else if (
    inputFields.length === 3 &&
    inputFields[2].predicate === "address"
  ) {
    hotelData = [
      {
        name,
        phone: "",
        address,
      },
    ];
  }
  return await hotelData;
};

// computer confidence name
const fetchNameConfidence = async (data, place, state) => {
  let confidence = 0.0;
  let confidenceGoogle = 0.0;
  let confidenceOpen = 0.0;
  let confidenceYendax = 0.0;

  {
    data.map((d) => {
      // confidence google
      if (d.dataSource === "Google" && d.name.includes(place) === true) {
        confidenceGoogle = Number(state.googleWeight);
      }

      // confidence open
      if (d.dataSource === "Open" && d.name.includes(place) === true) {
        confidenceOpen = Number(state.openWeight);
      }

      // confidence yendax
      if (d.dataSource === "Yendax" && d.name.includes(place) === true) {
        confidenceYendax = Number(state.yandexWeight);
      }
      return <div>&nbsp;</div>;
    });

    if (
      confidenceGoogle !== 0.0 &&
      confidenceOpen !== 0.0 &&
      confidenceYendax !== 0.0
    ) {
      confidence = confidenceGoogle + confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0 && confidenceOpen !== 0.0) {
      confidence = confidenceGoogle + confidenceOpen;
    } else if (confidenceGoogle !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceGoogle + confidenceYendax;
    } else if (confidenceOpen !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0) {
      confidence = confidenceGoogle;
    } else if (confidenceOpen !== 0.0) {
      confidence = confidenceOpen;
    } else {
      confidence = confidenceYendax;
    }
    return await confidence;
  }
};
const fetchPhoneConfidence = async (data, phone, state) => {
  let confidence = 0.0;
  let confidenceGoogle = 0.0;
  let confidenceOpen = 0.0;
  let confidenceYendax = 0.0;
  {
    data.map((d) => {
      // confidence google
      if (d.dataSource === "Google" && phone === d.phone) {
        confidenceGoogle = Number(state.googleWeight);
      }

      // confidence open
      if (d.dataSource === "Open" && phone === d.phone) {
        confidenceOpen = Number(state.openWeight);
      }

      // confidence yendax
      if (d.dataSource === "Yendax" && phone === d.phone) {
        confidenceYendax = Number(state.yandexWeight);
      }
      return <div>&nbsp;</div>;
    });

    if (
      confidenceGoogle !== 0.0 &&
      confidenceOpen !== 0.0 &&
      confidenceYendax !== 0.0
    ) {
      confidence = confidenceGoogle + confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0 && confidenceOpen !== 0.0) {
      confidence = confidenceGoogle + confidenceOpen;
    } else if (confidenceGoogle !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceGoogle + confidenceYendax;
    } else if (confidenceOpen !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0) {
      confidence = confidenceGoogle;
    } else if (confidenceOpen !== 0.0) {
      confidence = confidenceOpen;
    } else {
      confidence = confidenceYendax;
    }

    return await confidence;
  }
};
const fetchAddressConfidence = async (data, address, state) => {
  let confidence = 0.0;
  let confidenceGoogle = 0.0;
  let confidenceOpen = 0.0;
  let confidenceYendax = 0.0;
  {
    data.map((d) => {
      // confidence google
      //console.log(address.includes(d.address));
      if (d.dataSource === "Google" && d.address.includes(address) === true) {
        confidenceGoogle = Number(state.googleWeight);
      }

      // confidence open
      if (d.dataSource === "Open" && d.address.includes(address) === true) {
        confidenceOpen = Number(state.openWeight);
      }

      // confidence yendax
      if (d.dataSource === "Yendax" && d.address.includes(address) === true) {
        confidenceYendax = Number(state.yandexWeight);
      }
      return <div>&nbsp;</div>;
    });

    if (
      confidenceGoogle !== 0.0 &&
      confidenceOpen !== 0.0 &&
      confidenceYendax !== 0.0
    ) {
      confidence = confidenceGoogle + confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0 && confidenceOpen !== 0.0) {
      confidence = confidenceGoogle + confidenceOpen;
    } else if (confidenceGoogle !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceGoogle + confidenceYendax;
    } else if (confidenceOpen !== 0.0 && confidenceYendax !== 0.0) {
      confidence = confidenceOpen + confidenceYendax;
    } else if (confidenceGoogle !== 0.0) {
      confidence = confidenceGoogle;
    } else if (confidenceOpen !== 0.0) {
      confidence = confidenceOpen;
    } else {
      confidence = confidenceYendax;
    }

    return await confidence;
  }
};
export {
  fetchGooglePlace,
  fetchOpenPlaceDetail,
  fetchYendaxPlaceDetail,
  fetchHotelPlaceDetail,
  fetchNameConfidence,
  fetchPhoneConfidence,
  fetchAddressConfidence,
};
