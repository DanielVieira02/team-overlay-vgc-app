import { TeamRenderer } from '../components/renderer/TeamRenderer';
import { useParams } from "react-router";

import "./teamListRenderer.css";

const TeamListRendererPage = () => {
  let { pokepaste } = useParams();
  
  return (
    <div className="teamRenderer">
      {pokepaste !== undefined &&
        <TeamRenderer pokepasteUrl={`https://pokepast.es/${pokepaste}/raw`} />
      }      
    </div>
  );
};

export default TeamListRendererPage;
