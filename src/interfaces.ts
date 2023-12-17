export interface FecthResult<TypeResult> {
  results? : { bindings: TypeResult[] };
}

export interface QueryValue {
  value: string;
}

export interface SearchQueryResult {
  description: QueryValue;
  title: QueryValue;
  id: QueryValue;
  imageSrc: QueryValue;
  type?: QueryValue;
}

export type SearchType = 'Sport' | 'Athlète' | 'Pays' | 'Edition';