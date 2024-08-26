import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Chessboard from './components/Chessboard';
import ExtendedBoard from './components/ExtendedBoard';
import LoginPage from './LoginPage'; // Importing the LoginPage component

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route for the login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Route for the chessboard page */}
        <Route path="/chessboard" element={<Chessboard />} />

        {/* Route for the extended board page */}
        <Route path="/extended-board" element={<ExtendedBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
