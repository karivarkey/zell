import { create } from "zustand";
import axios from "axios";
import { Property } from "@/types/types";
import { API } from "@/constants/constants";

interface ApartmentStore {
  apartments: Property[];
  fetchApartments: () => Promise<void>;
}
export const useApartmentStore = create<ApartmentStore>((set, get) => ({
  apartments: [],
  fetchApartments: async () => {
    if (get().apartments.length > 0) return; // Prevent refetching if data exists
    try {
      const res = await axios.get<Property[]>(
        `${API}/apartments/getApartments`
      );
      set({ apartments: res.data });
    } catch (err) {
      console.error("Error fetching apartments:", err);
    }
  },
}));
