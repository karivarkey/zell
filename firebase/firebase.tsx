import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  initializeAuth, 
  
} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDySBa2DdPoOHdl7AtGeBAueMWKfBPRzJc",
  authDomain: "zelldotcom-d42f3.firebaseapp.com",
  projectId: "zelldotcom-d42f3",
  storageBucket: "zelldotcom-d42f3.appspot.com", // Fixed incorrect domain
  messagingSenderId: "845082295063",
  appId: "1:845082295063:web:66eea39aebb8df741c5552"
};

const app = initializeApp(firebaseConfig);

// ✅ Use `initializeAuth` with persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };
