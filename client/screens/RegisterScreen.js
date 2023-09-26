import { StyleSheet, Text, Image, SafeAreaView, Alert } from "react-native";
import React, { useState } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:8000/register", user)
      .then((response) => {
        Alert.alert(
          "Registration Successfully! Please check your email inbox to verify the user"
        );
        setEmail("");
        setName("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert("error in registration", error);
        console.log("ERROR IN REGISTERING", error.message);
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
      <View style={{ marginTop: 20, height: 100 }}>
        <Image
          // style={{ width: 120, height: 170 }}
          style={{ width: 200, height: 90 }}
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/019/766/240/original/amazon-logo-amazon-icon-transparent-free-png.png",
            // uri: "https://scontent.fpkr1-1.fna.fbcdn.net/v/t1.15752-9/379564364_687749946582644_9160764980483132051_n.png?_nc_cat=107&ccb=1-7&_nc_sid=ae9488&_nc_ohc=dYlBDYB1efYAX9_bMVt&_nc_ht=scontent.fpkr1-1.fna&oh=03_AdRBttUrKgldP2S1jL-gXYBksVhFBoiuQRKfqbRgusAPxQ&oe=65312598",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 19, fontWeight: "bold", marginTop: 80 }}>
            Register your account
          </Text>
        </View>
        {/* for name */}
        <View style={{ marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: "#d0d0d0",
              paddingHorizontal: 10,
              marginTop: 30,
              height: 40,
            }}>
            <Ionicons
              style={{ color: "gray" }}
              name="person"
              size={24}
              color="black"
            />

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ color: "black", width: 300 }}
              placeholder="Please enter your name here..."
            />
          </View>
        </View>

        <View style={{ marginTop: 0 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: "#d0d0d0",
              paddingHorizontal: 10,
              marginTop: 30,
              height: 40,
            }}>
            <MaterialIcons
              style={{ color: "gray" }}
              name="email"
              size={24}
              color="black"
            />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{ color: "black", width: 300 }}
              placeholder="Please enter your email here..."
            />
          </View>
        </View>

        {/* for password  */}
        <View style={{ marginTop: 30 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: "#d0d0d0",
              paddingHorizontal: 10,
              marginTop: 0,
              height: 40,
            }}>
            <AntDesign
              style={{ color: "gray" }}
              name="lock"
              size={24}
              color="black"
            />

            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={{ color: "black", width: 300 }}
              placeholder="Please enter your password here..."
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Text>Keep me logged in</Text>
          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 30 }} />

        <Pressable
          onPress={handleRegister}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}>
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}>
            Register Now
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
            Already have an account? Login In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
