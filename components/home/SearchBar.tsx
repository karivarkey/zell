import { View, TextInput } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View className="flex-row items-center bg-[#222] p-4 rounded-xl border border-[#333]">
      <Ionicons name="search" size={20} color="#D7FC70" className="mr-2" />
      <TextInput
        className="flex-1 text-white"
        placeholder="Search for products"
        placeholderTextColor="#888"
        value={query}
        onChangeText={handleChange}
      />
      <Link href="/search">
        <AntDesign name="camera" size={24} color="gray" />
      </Link>
    </View>
  );
};

export default SearchBar;
