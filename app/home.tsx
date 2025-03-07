import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { signOut } from "@firebase/auth";
import { auth } from "@/firebase/firebase";
type Props = {};

const home = (props: Props) => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => signOut(auth)}>
        <Text>home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
