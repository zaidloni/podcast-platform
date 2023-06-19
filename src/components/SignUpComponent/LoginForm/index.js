import { useState } from "react";
import InputComponent from "../../common/InputComponent";
import Button from "../../common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../../../slices/userSlice";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (email && password) {
      try {
        // Login into account
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Saving user details
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        dispatch(
          setUser({
            name: userData.name,
            email: userData.email,
            uid: userData.uid,
          })
        );

        toast.success("Login Sucessfull");
        setLoading(false);

        navigate("/profile");
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("All fields are required")
      setLoading(false)
    }
  };
  return (
    <>
      <InputComponent
        state={email}
        setState={setEmail}
        type="email"
        placeholder="Email"
        required={true}
      />

      <InputComponent
        state={password}
        setState={setPassword}
        type="password"
        placeholder="Password"
        required={true}
      />

      <Button
        text={loading ? "Loading..." : "Login"}
        disabled={loading}
        onClick={handleLogin}
      />
    </>
  );
};

export default LoginForm;
