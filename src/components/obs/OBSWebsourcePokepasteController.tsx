import { useMutation } from "@tanstack/react-query"
import { SetOBSWebsourceUrl } from "../../lib/obsConnection"
import OBSWebSocket from "obs-websocket-js"
import { useState } from "react"
import { InputField } from "../ui/InputField"

interface OBSWebsourcePokepasteControllerProps {
    obsConnection: OBSWebSocket,
    inputName: string
}

export const OBSWebsourcePokepasteController = ({
    obsConnection,
    inputName,
}: OBSWebsourcePokepasteControllerProps) => {
    const [ pokepaste, setPokepaste ] = useState<string>("");

    const transformPokepaste = function (pokepaste: string) {
        return "http://localhost:3000/teamlist/" + pokepaste.split("https://pokepast.es/")[1];
    }

    const updateTeamUrlMutation = useMutation({
        mutationFn: () => SetOBSWebsourceUrl(obsConnection, inputName, transformPokepaste(pokepaste ?? ""))
    })

    const handleSetPokepaste = function (newPokepaste: any) {
        setPokepaste(newPokepaste);
    }

    return (
        <div>
            <h3>{inputName}</h3>
            <InputField 
                label="Insira aqui a poképaste"
                value={pokepaste}
                onChange={handleSetPokepaste}
            />
            <button
                onClick={() => {
                    updateTeamUrlMutation.mutate();
                }}
            >
                Atualizar paste
            </button>
        </div>
    )
}