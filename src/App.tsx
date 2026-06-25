import LandingPage from './pages/LandingPage/LandingPage';
import FollowCursor from './components/FollowCursor';
import './App.css';

function App() {
  return (
    <>
      <FollowCursor color="rgba(255, 255, 255, 0.4)" zIndex={99999} />
      <LandingPage />
    </>
  );
}

export default App;