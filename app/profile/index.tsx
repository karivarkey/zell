import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "@/firebase/firebase"; // Import Firebase Auth and Firestore
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { Toast } from "toastify-react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { useRouter } from "expo-router";
type Props = {};

const Profile = (props: Props) => {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [user, setUser] = useState<any>(null); // Store the current user
  const navigation = useNavigation(); // For navigating to orders
  const router = useRouter();
  // Load user data when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch username from Firestore or Auth displayName
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUsername(
            userDoc.data().username || currentUser.displayName || "User"
          );
        } else {
          setUsername(currentUser.displayName || "User");
        }
      } else {
        setUser(null);
        setUsername("");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handle username update
  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a new username.");
      return;
    }

    if (!user) {
      Alert.alert("Error", "No user logged in.");
      return;
    }

    try {
      // Update Firebase Auth profile (optional)
      await updateProfile(user, {
        displayName: newUsername,
      });

      setUsername(newUsername);
      setNewUsername("");
      Alert.alert("Success", "Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Failed to update username. Please try again.");
    }
  };

  // Send password reset email
  const handleSendPasswordReset = async () => {
    if (!user?.email) {
      Alert.alert("Error", "No email associated with this account.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert("Success", "Password reset email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending password reset:", error);
      Alert.alert(
        "Error",
        "Failed to send password reset email. Please try again."
      );
    }
  };
  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Toast.success("Signed Out Successfully!", "bottom");
    } catch (error: any) {
      Toast.error(`Sign Out Failed: ${error.message}`, "bottom");
    }
  };
  // Delete user account
  const handleDeleteUser = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) {
              Alert.alert("Error", "No user logged in.");
              return;
            }

            try {
              await deleteUser(user);
              Alert.alert("Success", "Account deleted successfully.");
              // Optionally navigate to login or home screen
              navigation.navigate("Login" as never); // Adjust based on your navigation structure
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert(
                "Error",
                "Failed to delete account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // Navigate to past orders
  const handleViewOrders = () => {
    if (user) {
      router.push("/profile/orders");
    } else {
      Alert.alert("Error", "No user logged in.");
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-black p-5">
        <Text className="text-[#D7FC70] text-center text-lg mt-10">
          No user logged in. Please log in.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black p-5">
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
      >
        <Text className="text-start  text-white text-2xl font-bold  mb-5 w-fit">
          Back
        </Text>
      </TouchableOpacity>

      <Text className="text-[#D7FC70] text-2xl font-bold text-center mb-5">
        Profile
      </Text>

      <View className="bg-gray-900 p-4 rounded-lg shadow-lg">
        <Text className="text-[#D7FC70] text-lg mb-2">Current Username:</Text>
        <Text className="text-white text-xl mb-4">{username}</Text>

        <TextInput
          className="bg-white rounded-md p-3 mb-4 text-base"
          placeholder="New Username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="bg-[#D7FC70] py-3 rounded-md mb-3"
          onPress={handleUpdateUsername}
        >
          <Text className="text-black text-center font-semibold text-base">
            Update Username
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#D7FC70] py-3 rounded-md mb-3"
          onPress={handleSendPasswordReset}
        >
          <Text className="text-black text-center font-semibold text-base">
            Send Password Reset Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 py-3 rounded-md mb-3"
          onPress={handleDeleteUser}
        >
          <Text className="text-white text-center font-semibold text-base">
            Delete Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#D7FC70] py-3 rounded-md"
          onPress={handleViewOrders}
        >
          <Text className="text-black text-center font-semibold text-base">
            View Past Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-[#D7FC70] flex-row items-center justify-center gap-2 py-4 px-6 rounded-xl mt-4"
        >
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text className="text-black text-xl font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
