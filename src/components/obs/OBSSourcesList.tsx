import { useState } from "react";
import { SelectList } from "../ui/SelectList";
import OBSWebSocket from "obs-websocket-js";
import { GetOBSWebsourcesList } from "../../lib/obsConnection";
import { useQuery } from "@tanstack/react-query";

interface OBSWebsourcesListProps {
    obsConnection: OBSWebSocket,
    scene: string,
    onSelectSource: (source: string) => void
}

export const OBSWebsourcesList = ({
    obsConnection,
    scene,
    onSelectSource
}: OBSWebsourcesListProps) => {
    const { isPending: sourcesLoading, error: sourcesError, data: sourcesList } = useQuery({
        queryKey: ["obsWebsourcesList", scene],
        queryFn: () => GetOBSWebsourcesList(obsConnection, scene),
    });

    const handleSelectedSource = function (event: any) {
        onSelectSource(event.target.value);
    }

    if (sourcesLoading) {
        return "Carregando cenas..."
    }

    if (sourcesError) {
        return "Erro ao carregar cenas: " + sourcesError.message;
    }
    const sourcesName = sourcesList.map((source) => source.sourceName);

    return (
        <div>
            <SelectList
                onChange={handleSelectedSource}
                values={sourcesName}
                multiple={true}
            />
        </div>
    )
}