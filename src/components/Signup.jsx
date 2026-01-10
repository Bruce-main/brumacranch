import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading("Please wait as we sign you up...");
    setError("");

    try {
      // ✅ Send JSON payload
      const response = await axios.post(
        "https://brumacranch2point0.pythonanywhere.com/api/signup",
        { username, email, phone, password },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading("");
      if (response.status === 201) {
        // Signup successful → save user info if backend returns it
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/Getproducts"); // Redirect to products page
      } else {
        setError(response.data.Message || "Signup failed. Try again.");
      }
    } catch (err) {
      setLoading("");
      // Show detailed backend message if available
      if (err.response?.data?.Error) {
        setError(err.response.data.Error);
      } else if (err.response?.data?.Message) {
        setError(err.response.data.Message);
      } else {
        setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className='row justify-content-center mt-5'>
      <div className="card shadow col-md-6 p-4">
        <h2>Sign up</h2>
        {loading && <p className="text-success">{loading}</p>}
        {error && <p className="text-danger">{error}</p>}
        
        <form onSubmit={submit}>
          <input 
            type="text"
            placeholder='Enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='form-control'  
          /> <br />

          <input 
            type="email"
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='form-control'  
          /> <br />

          <input 
            type="text"
            placeholder='Enter your phone number'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className='form-control'  
          /> <br />

          <div className="input-group">
            <input 
              type={passwordVisible ? "text" : "password"}
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='form-control'
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(prev => !prev)} 
              className="btn btn-outline-secondary"
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div> <br />
          
          <button type="submit" className='btn btn-success w-100'>Sign up</button>

          <p className="mt-3 text-center">
            Already have an account? <a href="/Signin" className="text-success">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
