import './App.css';
import { PlayerRegistration } from './components/PlayerRegistration';
import { TeamRenderer } from './components/TeamRenderer';

const App = () => {
  return (
    <div className="content">
      <div>
        <PlayerRegistration />
      </div>
    </div>
  );
};

export default App;
