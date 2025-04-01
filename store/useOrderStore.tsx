import { create } from "zustand";
import { Order } from "@/types/types";
import { auth, db } from "@/firebase/firebase"; // Import Firebase Auth & Firestore
import { collection, getDocs } from "firebase/firestore";

type OrderStore = {
  orders: Order[];
  fetchOrders: () => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],

  fetchOrders: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);

      let fetchedOrders: Order[] = [];

      querySnapshot.forEach((doc) => {
        const orderData = doc.data() as Order;

        // Check if any product in this order belongs to the current vendor
        const hasVendorProduct = orderData.products.some(
          (product) => product.vendorId === user.uid
        );

        if (hasVendorProduct) {
          fetchedOrders.push({ id: doc.id, ...orderData });
        }
      });

      set({ orders: fetchedOrders });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },
}));
