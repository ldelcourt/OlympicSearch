export interface FecthResult {
  results : { bindings: SearchQueryResult[] };
}

export interface SearchQueryResult {
  description: { value?: string };
  title: { value?: string };
  id: { value?: string };
  imageSrc: { value?: string };
  type?: { value: string };
}

export type SearchType = 'Sport' | 'Athlète' | 'Pays' | 'Edition';