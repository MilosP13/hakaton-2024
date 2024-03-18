import './App.css';
import Main from './components/Main/Main';
// import MapComponent from './components/Map/MapComponent';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Navbar positioned at the top */}
        <Routes>
          <Route path="/" element={<Main />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;