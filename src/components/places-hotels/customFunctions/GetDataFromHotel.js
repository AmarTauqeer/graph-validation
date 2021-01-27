import React from "react";
class GetDataFromHotel extends React.Component {
  constructor(endpoint) {
    super(endpoint);
    this.endpoint = endpoint;
  }
  async query(sparqlQueryHotel) {
    const fullUrl =
      (await this.endpoint) + "?query=" + encodeURIComponent(sparqlQueryHotel);
    const headers = { Accept: "application/sparql-results+json" };

    return await fetch(fullUrl, { headers }).then((body) => body.json());
  }
}

export default GetDataFromHotel;
