// components/SignInSignUp.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../slices/userSlice";
import { auth, db, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InputComponent from "../components/Input";
import Button from "../components/Button";
import FileInput from "../components/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

function SignInSignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [flag, setFlag] = useState(false);
  const [fileURL, setFileURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        uid: user.uid,
        profilePic: fileURL,
      });

      // Update authentication state and user information in the store
      dispatch(
        setUser({
          email: user.email,
          uid: user.uid,
          name: name,
          profilePic: fileURL,
        })
      );
      setLoading(false);

      toast.success("User Signup Successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
    }
  };

  const handleSignIn = async (e, p) => {
    console.log(e,p);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
       e || email,
       p|| password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      dispatch(
        setUser({
          name: userData.name,
          email: user.email,
          uid: user.uid,
          profilePic: userData.profilePic,
        })
      );
      setLoading(false);
      toast.success("User Login Successful!");
      navigate("/profile");
      // Navigate to the profile page
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     dispatch(clearUser());
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //   }
  // };

  const uploadImage = async (file) => {
    setLoading(true);
    console.log("hi", file);
    try {
      const imageRef = ref(storage, `profile/${Date.now()}`);
      await uploadBytes(imageRef, file);

      const imageURL = await getDownloadURL(imageRef);
      setFileURL(imageURL);
      setLoading(false);
      console.log("IMageURL", imageURL);
      toast.success("Image Uploaded!");
    } catch (e) {
      console.log(e);
      toast.error("Error Occurred!");
    }
  };

  return (
    <div>
      <Header flag={flag} />
      <button className="demo" onClick={() => handleSignIn("zaid@gmail.com", "zaidzaid")}>Try Demo Mode</button>
      {/* <Button text={"Demo"} onClick={handleSignIn}/> */}
      {!flag ? (
        <div className="wrapper">
          <h1>Sign Up</h1>
          <form>
            <InputComponent
              type="text"
              placeholder="Full Name"
              state={name}
              setState={setName}
            />
            <InputComponent
              type="email"
              placeholder="Email"
              state={email}
              setState={setEmail}
            />
            <InputComponent
              type="password"
              placeholder="Password"
              state={password}
              setState={setPassword}
            />

            <FileInput
              id="user-image"
              onFileSelected={uploadImage}
              text={"Upload Display Img"}
              accept={"image/*"}
            />

            <Button
              onClick={handleSignUp}
              text={loading ? "Loading..." : "Sign Up"}
            />
          </form>
        </div>
      ) : (
        <div>
          <div className="wrapper">
            <h1>Sign In</h1>
            <form>
              <InputComponent
                type="email"
                placeholder="Email"
                state={email}
                setState={setEmail}
              />
              <InputComponent
                type="password"
                placeholder="Password"
                state={password}
                setState={setPassword}
              />

              <Button
                onClick={handleSignIn}
                text={loading ? "Loading..." : "Sign In"}
              />
            </form>
          </div>
        </div>
      )}
      <p
        style={{ cursor: "pointer", marginTop: "2rem" }}
        onClick={() => setFlag(!flag)}
      >
        {flag
          ? "Don't have an Account? Sign Up."
          : "Already Have An Account? Sign In."}
      </p>
    </div>
  );
}

export default SignInSignUp;
