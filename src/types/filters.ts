export interface FilterClause {
  key: 'status' | 'from' | 'to' | 'tier';
  value: string;
}

export interface FilterQuery {
  status?: string;
  from?: string;
  to?: string;
  tier?: string;
}
