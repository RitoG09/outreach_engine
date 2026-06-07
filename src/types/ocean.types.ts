export type Relevance = "A" | "B" | "C";

export interface TargetCompany {
  domain: string;
  name: string;
  relevance: Relevance;
}

export interface OceanSearchResponse {
  total?: number;
  creditsUsed?: number;
  searchAfter?: string;
  companies: {
    relevance: Relevance;
    company: {
      domain: string;
      name: string;
      primaryCountry?: string;
      companySize?: string;
      description?: string;
    };
  }[];
}
