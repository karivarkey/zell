export interface Product {
  name: string;
  quantity: number;
  price: number;
  brandName: string;
  id: string;
  rating: number;
  reviews: Review[];
  vendorId: string;
  features: {
    category: string;
    features: string[];
  };
  imageUrl: string;
}

export interface Vendor {
  vendorId: string;
  vendorName: string;
  rating: number;
  reviews: Review[];
  orders: Order[];
  location: {
    address: string;
    lat: number;
    long: number;
  };
}

export interface Order {
  userId: string;
  id?: string;
  shippingAddress: string;
  status: "delivered" | "shipped" | "cancelled";
  price: number;
  products: Product[];
}

export interface Review {
  userId: string;
  title: string;
  review: string;
  rating: number;
}

export interface LandLord {
  Id: string;
  properties: Property[];
  rating: number;
}

export interface Property {
  id: string;
  name: string;
  location: {
    address: string;
    lat: number;
    long: number;
  };
  reviews: Review[];
  rating: number;
  price: number;
  contact: number;
  imageUrl: string;
}
export interface Rating {
  uid: string;
  rating: number;
  reviews: Review[];
  productId: string;
}
