import './App.css';
import { TeamRenderer } from './components/TeamRenderer';

const App = () => {
  return (
    <div className="content">
      <TeamRenderer pokepasteUrl='https://pokepast.es/c6a78cbb3f373a59/raw'/>
    </div>
  );
};

export default App;
