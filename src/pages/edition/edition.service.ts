export type EditionData = {
  edition?: string;
  location?: string;
  country: string;
  logo_url: string;
  second_logo_url: string;
  participants_count: number;
  nations_count: number;
  sports_count: number;
  start_date: string;
  end_date: string;
};

export type Ranking = {
  country: string;
  bronze: number;
  silver: number;
  gold: number;
};

export const fetchEditionData = async (
  edition?: string
): Promise<EditionData | undefined> => {
  const base_endpoint = "https://query.wikidata.org/sparql";
  const edition_query = `
    wd:${edition} rdfs:label ?edition.
    FILTER(lang(?edition) = 'fr').
    `;
  const logo_query = `
    wd:${edition} p:P154 ?logo.
    ?logo ps:P154 ?logoUrl.
    `;
  
  const second_logo_query = `
  wd:${edition} wdt:P18 ?secondLogoUrl.
  `;


  const location_query = `
    wd:${edition} p:P276 ?l.
    ?l ps:P276 ?locationPage.
    ?locationPage rdfs:label ?location.
    FILTER(lang(?location) = 'fr').
    `;

  const counts_query = `
    wd:${edition} p:P1132 ?n.
    ?n ps:P1132 ?count.
    BIND(xsd:integer(?count) AS ?countValue).
    `;

  const country_query = `
    wd:${edition} p:P17 ?c.
    ?c ps:P17 ?countryPage.
    ?countryPage rdfs:label ?country.
    FILTER(lang(?country) = 'fr').
    `;

  const start_time_query = `
    wd:${edition} p:P580 ?st.
    ?st ps:P580 ?start_time.
    `;

  const end_time_query = `
    wd:${edition} p:P582 ?et.
    ?et ps:P582 ?end_time.
    `;

  const query = `
    SELECT ?edition ?location ?country ?logoUrl ?secondLogoUrl ?countValue ?start_time ?end_time
    WHERE {
      ${edition_query}
      OPTIONAL{
        ${location_query}
      }
      OPTIONAL{
        ${country_query}
      }
      OPTIONAL {
        ${counts_query}
      }
      OPTIONAL {
        ${logo_query}
      }
      OPTIONAl {
        ${second_logo_query}
      }
      OPTIONAL {
        ${start_time_query}
        ${end_time_query}
      }
    }`;

  const sports_query = `
    SELECT *
    WHERE {
      wd:Q159821 p:P527 ?og.
      ?og ps:P527 wd:${edition}.
      ${edition_query}
      wd:${edition} p:P527 ?s.
      ?s ps:P527 ?sports.
    }
    `;

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
      console.log({res});
      if (res.results.bindings?.length) {
        let nations_count = +res.results.bindings[0]?.countValue.value;
        for (const bind of res.results.bindings) {
          if (+bind?.countValue.value < nations_count)
            nations_count = +bind?.countValue.value;
        }

        let participants_count = +res.results.bindings[0].countValue.value;
        for (const bind of res.results.bindings) {
          if (+bind?.countValue.value > participants_count)
            participants_count = +bind?.countValue.value;
        }

        let sports_count = 0;
        if (sports_response.ok) {
          const sports_res = await sports_response.json();
          sports_count = sports_res.results.bindings.length;
        }

        const data = res.results?.bindings[0];
        return {
          edition: data?.edition?.value,
          logo_url: data?.logoUrl?.value,
          second_logo_url: data?.secondLogoUrl?.value,
          location: data?.location.value,
          country: data?.country?.value,
          participants_count,
          nations_count,
          sports_count,
          start_date: data?.start_time.value
            ? parseDateToFrenchFormat(data?.start_time.value)
            : "",
          end_date: data?.end_time.value
            ? parseDateToFrenchFormat(data?.end_time.value)
            : "",
        };
      }
    } else {
      console.error("Erreur lors de la requête SPARQL");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

export const fetchSports = async (
  edition?: string
): Promise<string[] | undefined> => {
  const base_endpoint = "https://query.wikidata.org/sparql";

  const query = `
    SELECT ?sport_label
    WHERE {
      wd:${edition} p:P527 ?sp.
      ?sp ps:P527 ?sports_page.
      ?sports_page p:P641 ?s.
      ?s ps:P641 ?sport.
      ?sport rdfs:label ?sport_label.
      FILTER(lang(?sport_label) = 'fr')
    }`;

  try {
    const response = await fetch(
      `${base_endpoint}?query=${encodeURIComponent(query)}&format=json`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const res = await response.json();
      if (res.results.bindings?.length) {
        const data: string[] = res.results.bindings.map((res: any) => {
          return (
            res.sport_label.value.charAt(0).toUpperCase() +
            res.sport_label.value.slice(1).toLowerCase()
          );
        });
        return data;
      }
    } else {
      console.error("Erreur lors de la requête SPARQL");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

export const fetchEditionsLink = async (
  edition?: string
): Promise<any | undefined> => {
  const base_endpoint = "https://query.wikidata.org/sparql";

  const query = `
    SELECT ?previous ?next
    WHERE {
      wd:${edition} p:P155 ?previous_page; p:P156 ?next_page.
      ?previous_page ps:P155 ?previous.
      ?next_page ps:P156 ?next
    }`;

  try {
    const response = await fetch(
      `${base_endpoint}?query=${encodeURIComponent(query)}&format=json`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const res = await response.json();
      console.log(res);
      if (res.results.bindings?.length) {
        const data = res.results.bindings[0];
        return {
          previous:
            data.previous.value.split("/")[
              data.previous.value.split("/").length - 1
            ],
          next: data.next.value.split("/")[
            data.next.value.split("/").length - 1
          ],
        };
      }
    } else {
      console.error("Erreur lors de la requête SPARQL");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

export const fetchRanking = async (
  edition?: string
): Promise<Ranking[] | undefined> => {
  const base_endpoint = "https://query.wikidata.org/sparql";

  const query = `
    SELECT ?country_name ?gold_medals ?silver_medals ?bronze_medals
    WHERE {
      ?nation_page p:P1344 ?edition_page.
      ?edition_page ps:P1344 wd:${edition}.
      ?nation_page p:P17 ?country_page.
      ?country_page ps:P17 ?country.
      ?country rdfs:label ?country_name.
      OPTIONAL {
      ?nation_page p:P166 ?gold_page.
        ?gold_page ps:P166 wd:Q15243387.
        ?gold_page pq:P1114 ?gold_medals.
      }
      OPTIONAL {
        ?nation_page p:P166 ?silver_page.
        ?silver_page ps:P166 wd:Q15889641.
        ?silver_page pq:P1114 ?silver_medals.
      }
      OPTIONAL {
        ?nation_page p:P166 ?bronze_page.
        ?bronze_page ps:P166 wd:Q15889643.
        ?bronze_page pq:P1114 ?bronze_medals.
      }
      FILTER(lang(?country_name)='fr').
    }`;

  try {
    const response = await fetch(
      `${base_endpoint}?query=${encodeURIComponent(query)}&format=json`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const res = await response.json();
      if (res.results.bindings?.length) {
        const data = res.results.bindings.map((result: any) => {
          return {
            country: result?.country_name?.value,
            bronze: +(result?.bronze_medals?.value ?? 0),
            silver: +(result?.silver_medals?.value ?? 0),
            gold: +(result?.gold_medals?.value ?? 0),
          };
        });
        return data;
      }
    } else {
      console.error("Erreur lors de la requête SPARQL");
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
  }
};

export function parseDateToFrenchFormat(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  // Convertir la chaîne de date en objet Date
  const date = new Date(dateString);

  // Formater la date en utilisant les options spécifiées
  const formattedDate = date.toLocaleDateString("fr-FR", options);

  return formattedDate;
}
