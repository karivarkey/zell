export interface Product {
    uri: string;
    name: string;
    price: number;
    location: string;
    liked?: boolean;
    vendorId: string;
    productId: string;
}



export const demoData: Product = {
  uri: "https://res.cloudinary.com/dgeduh0en/image/upload/v1741405846/qg1rhbovlxhtuhb7697g.png",
  name: "iPhone 16 Pro Max",
  price: 99999, // Assuming price in INR
  location: "Apple Store, Edapally",
  liked: false, // Defaulting to not liked
  vendorId: "vendor_12345",
  productId: "product_67890",
};
