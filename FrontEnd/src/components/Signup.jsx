import React, { useState } from "react";
import { authStyles as styles } from "../assets/dummystyle";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";
import axiosInstace from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { Input } from "../components/Input";
const Signup = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstace.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      });

      const {token} = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong . please try again"
      );
    }
  };
  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join thousands of professionals today.
        </p>
      </div>

      {/* FORM */}
      <form className={styles.signupForm} onSubmit={handleSignup}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label={"Full Name"}
          placeholder={"John Doe"}
          type="text"
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label={"Email"}
          placeholder={"email@example.com"}
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label={"Password"}
          placeholder={"Min 8 characters"}
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button className={styles.signupSubmit} type="submit">
          Create Account
        </button>

        {/* Footer */}
        <p className={styles.switchText}>
          Already have an account?
          <button
            className={styles.signupSwitchButton}
            type="button"
            onClick={() => setCurrentPage("login")}
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Signup;
