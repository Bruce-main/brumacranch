import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading("Please wait as we log you in...");
    
    try {
      const data = new FormData();
      data.append("email", email);
      data.append("password", password);
      const response = await axios.post("https://brumacranch2point0.pythonanywhere.com/api/signin", data);
      
      setLoading("");
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/Getproducts");
      } else {
        setError("Email or password is incorrect");
      }
    } catch (error) {
      setLoading("");
      setError(error.response.data.Message);
    }
  }

  return (
    <div className='row justify-content-center mt-5'>
      <div className="card shadow col-md-6 p-4">
        <h2>Sign in</h2>
        {loading} <br />
        {error}
        
        <form onSubmit={submit}>
          <input 
            type="email"
            placeholder='Enter your email address here'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='form-control'  
          /> <br />

          <div className="input-group">
            <input 
              type={passwordVisible ? "text" : "password"}
              placeholder='Enter the password'
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
              {passwordVisible ? "👁️‍🗨️" : "👁️‍🗨️"}
            </button>
          </div> <br />
          
          <button type="submit" className='btn btn-success'>Sign in</button>

          <p className="mt-3 text-center">
               Don't have an account? <a href="/Signup" className="text-success">Sign up here</a>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signin;
