import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🌾 Welcome to BrumaCranch Farm Shop</h1>
        <p>
          BrumaCranch is a rustic farm-to-table project bringing fresh produce and handmade goods
          directly to our community.
        </p>
        <Link to="/signup" className="App-link">Create an Account & Join Us</Link>
        <Link to="/signin" className="App-link">Already have an account? Sign in</Link>
      </header>
    </div>
  );
}

export default Home;
