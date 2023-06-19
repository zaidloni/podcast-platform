import { useState } from "react";
import InputComponent from "../../common/InputComponent";
import Button from "../../common/Button";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);

    if (
      password === confirmPassword &&
      password.length >= 6 &&
      fullName &&
      email
    ) {
      try {
        // Creating an account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Saving user details
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
        });

        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
          })
        );
        setLoading(false);
        toast.success("User Created Successfully");
        navigate("/profile");
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      //throw error
      if (password !== confirmPassword) {
        toast.error("Password Mismatch");
      } else if (password.length < 6) {
        toast.error("Password should contains atleast 6 character");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <InputComponent
        state={fullName}
        setState={setFullName}
        type="text"
        placeholder="Full Name"
        required={true}
      />

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

      <InputComponent
        state={confirmPassword}
        setState={setConfirmPassword}
        type="password"
        placeholder="Confirm Password"
        required={true}
      />
      <Button
        text={loading ? "Loading..." : "SignUp"}
        disabled={loading}
        onClick={handleSignUp}
      />
    </>
  );
};

export default SignUpForm;
