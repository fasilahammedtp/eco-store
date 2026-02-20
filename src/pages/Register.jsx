import { useState } from "react";
import { registerUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";



function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
    setToast({ show: false, msg: "", type });
    }, 2500);
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if(!email.includes("@")){
    showToast("enter a valid email 📧","error")
    return;
  }
  if(password.length<6){
    showToast("Password must be at least 6 characters 🔐", "error");
    return;
  }

  const newUser = {
    name,
    email,
    password
  };



  try {
    const res = await registerUser(newUser);

    login(res.data); // this incldes id


    showToast("Account created successfully 🌱");

    setTimeout(() => {
      navigate("/");  
    }, 1800);

  } catch (err) {
    showToast("Registration failed ❌", "error");
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account 🌱</h2>

        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)}/>

        <input placeholder="Email address" value={email}  onChange={e => setEmail(e.target.value)}/>

        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
        <Toast 
           show={toast.show} 
           message={toast.msg} 
           type={toast.type} />


        <button onClick={handleRegister}>Sign Up</button>

        <p>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
export default Register;

