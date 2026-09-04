import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "./firebase.init";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSingIn = async () => {
    setLoading(true);
    const { GoogleAuthProvider: GPA, signInWithPopup: SIP } = await import("firebase/auth");
    const provider = new GPA();
    return SIP(auth, provider);
  };

  const logOut = () => {
    localStorage.removeItem("access-token");
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const sendResetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        const user = { email: currentUser.email };

        try {
          const { data } = await axiosPublic.post(`/jwt`, user, {
            withCredentials: true,
          });
          if (data?.token) {
            localStorage.setItem("access-token", data.token);
          }
          setTokenLoaded(true);
        } catch (error) {
          console.error("JWT TOKEN creation failed", error);
          localStorage.removeItem("access-token");
          setTokenLoaded(false);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          await axiosPublic.post(`/clear-jwt`, {}, { withCredentials: true });
        } catch (error) {
          console.error("jwt token clearing failed", error);
        } finally {
          localStorage.removeItem("access-token");
          setTokenLoaded(false);
          setLoading(false);
        }
      }
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
    googleSingIn,
    sendResetPassword,
    tokenLoaded,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
