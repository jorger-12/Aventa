export type BusinessType = {
  id: string;
  name: string;
};

export type BusinessCategory = {
  id: string;
  name: string;
  businessTypes: BusinessType[];
};
