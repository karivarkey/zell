import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { API } from "@/constants/constants";
import VendorNav from "@/components/vendor/VendorNav";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";

const ApartmentScreen = () => {
  const [apartments, setApartments] = useState<
    {
      id: string;
      name?: string;
      location?: { address: string; lat: number; long: number };
      price?: number;
      contact?: string;
      imageUrl?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [apartmentData, setApartmentData] = useState<{
    name: string;
    address: string;
    lat: string;
    long: string;
    price: string;
    contact: string;
    image: ImagePicker.ImagePickerAsset | null;
  }>({
    name: "",
    address: "",
    lat: "",
    long: "",
    price: "",
    contact: "",
    image: null,
  });

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "apartments"),
          where("vendorId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApartments(items);
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setApartmentData({ ...apartmentData, image: result.assets[0] });
    }
  };

  const handleAddApartment = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Toast.error("User not authenticated.");
        return;
      }

      const formData = new FormData();
      formData.append("name", apartmentData.name);
      formData.append("address", apartmentData.address);
      formData.append("lat", apartmentData.lat);
      formData.append("long", apartmentData.long);
      formData.append("price", apartmentData.price);
      formData.append("contact", apartmentData.contact);
      formData.append("vendorId", user.uid);

      if (apartmentData.image) {
        formData.append("image", {
          uri: apartmentData.image.uri,
          type: "image/jpeg",
          name: "apartment.jpg",
        } as any);
      }

      const response = await axios.post(
        `${API}/apartments/createApartment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        Toast.success("Apartment added successfully!");
        setApartmentData({
          name: "",
          address: "",
          lat: "",
          long: "",
          price: "",
          contact: "",
          image: null,
        });
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error adding apartment:", error);
      Toast.error("Failed to add apartment.");
    } finally {
      setLoading(false);
    }
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
          renderItem={({ item }) => (
            <View className="bg-gray-900 p-4 rounded-lg mb-4">
              <Text className="text-white text-lg font-semibold">
                {item.name}
              </Text>
              <Text className="text-gray-400">
                {item.location ? item.location.address : "No address available"}
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

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-32 right-6 bg-[#D7FC70] p-4 rounded-full"
      >
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>

      {/* Add Apartment Modal */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-[#D7FC70] text-xl font-bold mb-4">
            Add Apartment
          </Text>
          <TextInput
            placeholder="Name"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, name: text })
            }
          />
          <TextInput
            placeholder="Address"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, address: text })
            }
          />
          <TextInput
            placeholder="Latitude"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            keyboardType="numeric"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, lat: text })
            }
          />
          <TextInput
            placeholder="Longitude"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            keyboardType="numeric"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, long: text })
            }
          />
          <TextInput
            placeholder="Price"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            keyboardType="numeric"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, price: text })
            }
          />
          <TextInput
            placeholder="Contact"
            className="bg-gray-800 text-white p-3 rounded mb-3"
            keyboardType="numeric"
            onChangeText={(text) =>
              setApartmentData({ ...apartmentData, contact: text })
            }
          />
          <TouchableOpacity
            onPress={pickImage}
            className="bg-[#D7FC70] p-3 rounded mb-3"
          >
            <Text className="text-black text-center">Pick Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddApartment}
            className="bg-[#D7FC70] p-3 rounded"
          >
            <Text className="text-black text-center">Add Apartment</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <VendorNav />
    </View>
  );
};

export default ApartmentScreen;
