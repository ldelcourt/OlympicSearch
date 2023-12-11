export type EditionData = {
  edition?: string;
  location?: string;
  country: string;
  logo_url: string;
  participants_count: number;
  nations_count: number;
  sports_count: number;
  // start_date: Date;
  // end_date: Date;
};

export const fetchEditionData = async (
  edition?: string
): Promise<EditionData | undefined> => {
  const base_endpoint = "https://query.wikidata.org/sparql";
  const edition_query = `
    ?olympicGame p:P393 ?e.
    ?e ps:P393 ?editionNumber.
    ?olympicGame rdfs:label ?edition.
    FILTER(lang(?edition) = 'fr').
    FILTER(?editionNumber = "${edition}").
    `;
  const logo_query = `
    ?olympicGame p:P154 ?logo.
    ?logo ps:P154 ?logoUrl.
    `;

  const location_query = `
    ?olympicGame p:P276 ?l.
    ?l ps:P276 ?locationPage.
    ?locationPage rdfs:label ?location.
    FILTER(lang(?location) = 'fr').
    `;

  const counts_query = `
    ?olympicGame p:P1132 ?n.
    ?n ps:P1132 ?count.
    BIND(xsd:integer(?count) AS ?countValue).
    `;

  const country_query = `
    ?olympicGame p:P17 ?c.
    ?c ps:P17 ?countryPage.
    ?countryPage rdfs:label ?country.
    FILTER(lang(?country) = 'fr').
    `;

    const start_time_query = `
    ?olympicGame p:P580 ?st.
    ?st ps:P580 ?start_time_page.
    ?start_time_page rdfs:label ?start_time.
    FITLER(lang(?start_time) = 'fr').`

  const query = `
    SELECT ?edition ?location ?country ?logoUrl ?countValue
    WHERE {
      wd:Q159821 p:P527 ?og.
      ?og ps:P527 ?olympicGame.
      ${edition_query}
      ${location_query}
      ${country_query}
      ${counts_query}
      ${logo_query}
      ${start_time_query}
    }`;

    const sports_query = `
    SELECT *
    WHERE {
      wd:Q159821 p:P527 ?og.
      ?og ps:P527 ?olympicGame.
      ${edition_query}
      ?olympicGame p:P527 ?s.
      ?s ps:P527 ?sports.
    }
    `

  try {
    const response = await fetch(
      `${base_endpoint}?query=${encodeURIComponent(query)}&format=json`,
      {
        method: "GET",
      }
    );

    const sports_response = await fetch(
      `${base_endpoint}?query=${encodeURIComponent(sports_query)}&format=json`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const res = await response.json();
      if (res.results.bindings?.length) {

       let nations_count = +res.results.bindings[0].countValue.value;
       for(const bind of res.results.bindings){
        if(+bind.countValue.value < nations_count) nations_count = +bind.countValue.value;
       }

       let participants_count = +res.results.bindings[0].countValue.value;
       for(const bind of res.results.bindings){
        if(+bind.countValue.value > participants_count) participants_count = +bind.countValue.value;
       }

       let sports_count = 0;
       if(sports_response.ok){
        const sports_res = await sports_response.json();
        sports_count = sports_res.results.bindings.length
       }

        const data = res.results.bindings[0];
        return {
          edition: data.edition.value,
          logo_url: data.logoUrl.value,
          location: data.location.value,
          country: data.country.value,
          participants_count,
          nations_count,
          sports_count
        };
      }
    } else {
      console.error("Erreur lors de la requête SPARQL");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};