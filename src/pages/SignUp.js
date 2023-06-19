import Header from "../components/common/Header";

import React, { useState } from "react";
import SignUpForm from "../components/SignUpComponent/SignUpForm";
import LoginForm from "../components/SignUpComponent/LoginForm";

const SignUp = () => {
  const [flag, setFlag] = useState(false);
  return (
    <>
      <Header />
      <div className="input-wrapper">
        {!flag ? <h1>SignUp</h1> : <h1>Login</h1>}
        {!flag ? <SignUpForm /> : <LoginForm />}
        {!flag ? (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Already have an Account? Click here to Login.
          </p>
        ) : (
          <p style={{ cursor: "pointer" }} onClick={() => setFlag(!flag)}>
            Don't have an account? Click here to signup.{" "}
          </p>
        )}
      </div>
    </>
  );
};

export default SignUp;
