import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged, getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { app, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVendor, setIsVendor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Check if the user exists in the "vendors" collection
        const vendorRef = doc(db, "vendors", firebaseUser.uid);
        const vendorDoc = await getDoc(vendorRef);

        if (vendorDoc.exists()) {
          setIsVendor(true);
          router.replace("/vendor/home"); // Redirect vendors
        } else {
          setIsVendor(false);
          router.replace("/home"); // Redirect non-vendors
        }
      } else {
        router.replace("/splash"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isVendor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
