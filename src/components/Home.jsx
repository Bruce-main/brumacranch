import '../App.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="App bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <header className="text-center p-5 shadow rounded farm-header">
        <h1 className="fw-bold text-success mb-3">
          🌾 Welcome to <span className="text-brown">Brumac Ranch Farm Shop</span> 🌾
        </h1>
        <p className="fst-italic text-muted mb-4">
          Brumac ranch is a rustic farm-to-table project bringing fresh produce and handmade goods
          directly to our community. Experience freshness, authenticity, and the warmth of the farm.
        </p>

        <div className="d-flex flex-column gap-3 col-md-6 mx-auto">
          <Link to="/signup" className="btn btn-success fw-bold shadow">
            🌱 Create an Account & Join Us
          </Link>
          <Link to="/signin" className="btn btn-outline-success fw-bold shadow">
            🔑 Already have an account? Sign in
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Home;
