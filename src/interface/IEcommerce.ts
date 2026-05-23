export interface IProduct {
  id: number;
  name: string;
  image: string | null;
  price: number;
  stock: number;
  description: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  showcase_id: number | null;
  uom_id: number | null;
  rack_location: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: IProductCategory | null;
  subcategory?: IProductCategory | null;
  showcase?: IProductShowcase | null;
  uom?: IUom | null;
}

export interface IShopOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  qty: number;
  subtotal: number;
  product?: IProduct | null;
}

export interface IShopOrder {
  id: number;
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  note: string | null;
  total_amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  admin_seen_at: string | null;
  created_at: string;
  updated_at: string;
  items: IShopOrderItem[];
}

export interface IProductCategory {
  id: number;
  parent_id: number | null;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

export interface IUom {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
}

export interface IProductShowcase {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}
