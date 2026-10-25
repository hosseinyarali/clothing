export type LocationType = 'PROVINCE' | 'CITY';

export interface LocationResponse {
  id: number;
  name: string;
  type: LocationType;
  parentId: number | null;
}
