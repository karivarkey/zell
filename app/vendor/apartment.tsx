import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "expo-router";
import VendorNav from "@/components/vendor/VendorNav";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

const ApartmentScreen = () => {
  const [apartments, setApartments] = useState<
    { id: string; [key: string]: any }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "apartments"),
        where("vendorId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setApartments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("deleting");
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "apartments", id));
      setApartments((prev) => prev.filter((apartment) => apartment.id !== id));
    } catch (error) {
      console.error("Error deleting apartment:", error);
    } finally {
      setDeleting(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApartments();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
        Your Apartments
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#D7FC70" />
      ) : (
        <FlatList
          data={apartments}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View className="bg-gray-900 p-4 rounded-lg mb-4 relative">
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-600"
                disabled={deleting === item.id}
              >
                {deleting === item.id ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="trash" size={20} color="white" />
                )}
              </TouchableOpacity>

              <Text className="text-white text-lg font-semibold">
                {item.name}
              </Text>
              <Text className="text-gray-400">
                {item.location?.address || "No address available"}
              </Text>
              <Text className="text-[#D7FC70] font-semibold">
                ₹{item.price}
              </Text>
              <Text className="text-gray-400">📞 {item.contact}</Text>
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-40 rounded-lg mt-2"
                />
              )}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          router.push("/appartments/add");
        }}
        className="absolute bottom-32 right-6 bg-[#D7FC70] p-4 rounded-full"
      >
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>

      <VendorNav />
    </View>
  );
};

export default ApartmentScreen;
