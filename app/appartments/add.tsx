import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { auth } from "@/firebase/firebase";
import { API } from "@/constants/constants";
import { Toast } from "toastify-react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const AddApartment = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apartmentData, setApartmentData] = useState({
    name: "",
    address: "",
    lat: "",
    long: "",
    price: "",
    contact: "",
    image: null as ImagePicker.ImagePickerAsset | null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setApartmentData({ ...apartmentData, image: result.assets[0] });
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: apartmentData.address,
            format: "json",
            limit: 1,
          },
        }
      );
      console.log(response);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setApartmentData({
          ...apartmentData,
          lat: lat.toString(),
          long: lon.toString(),
        });
      } else {
        Toast.error("Address not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      Toast.error("Failed to fetch location");
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
        router.push("/vendor/apartment");
      }
    } catch (error) {
      console.error("Error adding apartment:", error);
      Toast.error("Failed to add apartment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black p-6">
      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-6">
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
      <TouchableOpacity
        onPress={fetchLocation}
        className="bg-[#D7FC70] p-3 rounded mb-3"
      >
        <Text className="text-black text-center">Fetch Location</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Latitude"
        className="bg-gray-800 text-white p-3 rounded mb-3"
        value={apartmentData.lat}
        editable={false}
      />
      <TextInput
        placeholder="Longitude"
        className="bg-gray-800 text-white p-3 rounded mb-3"
        value={apartmentData.long}
        editable={false}
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
      {apartmentData.image && (
        <Image
          source={{ uri: apartmentData.image.uri }}
          className="w-full h-40 rounded-lg mb-3"
        />
      )}
      <TouchableOpacity
        onPress={handleAddApartment}
        className="bg-[#D7FC70] p-3 rounded"
      >
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="text-black text-center">Add Apartment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddApartment;
