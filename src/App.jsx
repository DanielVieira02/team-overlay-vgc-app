import './App.css';
import { TeamRenderer } from './components/TeamRenderer';

const App = () => {
  return (
    <div className="content">
      <TeamRenderer pokepasteUrl='https://pokepast.es/531270a0f9e69727/raw'/>
    </div>
  );
};

export default App;
