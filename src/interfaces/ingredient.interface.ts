export interface Ingredient {
  id: number;
  name: string;
  max_stock_limit: number;
  stock_limit: number;
  stock_warning_status: boolean;
  unit: string;
}
