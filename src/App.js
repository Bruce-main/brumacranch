import './App.css';
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Home from './components/Home';
import Signup from './components/Signup';
import Signin from './components/Signin'; // ✅ new page
import Addproducts from './components/Addproducts';
import Getproducts from './components/Getproducts';
import Deletedproducts from './components/Deletedproducts';
import Navbar from './components/Navbar';
import GetIncome from './components/Getincome';
import AddIncome from './components/Addincome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/getincome" element={<GetIncome />} />
        <Route path="/addincome" element={<AddIncome />} />
        <Route path="/deletedproducts" element={<Deletedproducts />} />
        <Route path="/addproducts" element={<Addproducts />} />
        <Route path="/getproducts" element={<Getproducts />} />   {/* ✅ stocks route */}
      </Routes>
    </Router>
  );
}

export default App;
