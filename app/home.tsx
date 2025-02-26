import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { signOut } from "@firebase/auth";
import { auth } from "@/firebase/firebase";
type Props = {};

const home = (props: Props) => {
  return (
    <View>
      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text>home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({});
