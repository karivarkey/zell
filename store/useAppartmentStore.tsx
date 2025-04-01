import { create } from "zustand";
import { Property } from "@/types/types";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

interface ApartmentStore {
  apartments: Property[];
  fetchApartments: () => Promise<void>;
}

export const useApartmentStore = create<ApartmentStore>((set, get) => ({
  apartments: [],
  fetchApartments: async () => {
    if (get().apartments.length > 0) return; // Prevent refetching if data exists
    try {
      const apartmentsRef = collection(db, "apartments"); // ✅ Using db from @firebase
      const snapshot = await getDocs(apartmentsRef);

      const apartments: Property[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];

      set({ apartments });
    } catch (err) {
      console.error("Error fetching apartments:", err);
    }
  },
}));
