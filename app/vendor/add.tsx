import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import axios from "axios";
import { API } from "@/constants/constants";
import { auth } from "@/firebase/firebase";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState("");
  const [brandName, setBrandName] = useState("");
  const [image, setImage] = useState<any>(null); // Image state for storing picked image
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const cameraRef = React.useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
      skipProcessing: true,
    });

    if (photo) {
      setImage(photo);
    }
  };
  const handleSubmit = async () => {
    if (!name || !price || !quantity || !rating || !brandName || !image) {
      Alert.alert("Error", "Please fill all fields and capture an image");
      return;
    }

    const formData = new FormData();
    if (!auth.currentUser) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    formData.append("vendorId", auth.currentUser?.uid);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("rating", rating);
    formData.append("brandName", brandName);

    const uri = image.uri;

    // Append image using the specified structure
    formData.append("image", {
      uri: uri,
      name: "photo.jpg", // You can use a dynamic filename if you want
      type: "image/jpeg", // Adjust the type based on the image format if needed
    } as any);

    setLoading(true);

    try {
      const response = await axios.post(`${API}/product/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setStatus("Product added successfully!");
      } else {
        setStatus("Failed to add product");
      }
    } catch (error) {
      setStatus("Error: " + error.message);
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={styles.flipButton}
          >
            <Text style={styles.flipText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.captureButton} />
        </View>
      </CameraView>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.previewImage} />
      )}

      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Brand Name"
        value={brandName}
        onChangeText={setBrandName}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.submitButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.submitText}>Add Product</Text>
        )}
      </TouchableOpacity>

      {status && (
        <Text
          style={
            status.includes("Error") ? styles.errorText : styles.successText
          }
        >
          {status}
        </Text>
      )}
    </View>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: "black", padding: 20 },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    marginRight: 20,
  },
  flipText: { color: "white", fontWeight: "bold" },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "gray",
  },
  previewImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#D7FC70",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: { textAlign: "center", color: "black" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  permissionText: { color: "white", textAlign: "center", marginBottom: 20 },
  permissionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  permissionButtonText: { color: "white", fontWeight: "bold" },
  successText: { color: "green", textAlign: "center", marginTop: 10 },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
};

export default AddProduct;
