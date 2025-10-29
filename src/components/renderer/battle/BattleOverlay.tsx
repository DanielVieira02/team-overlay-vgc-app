import { useOBSConnection } from "@/src/hooks/use-obs-connection";
import { BattleOverlayController } from "./BattleOverlayController";

export const BattleOverlay = () => {
    const { connection, isConnected } = useOBSConnection();

    if(!isConnected || !connection) {
        return (<></>);
    }

    return (
        <>
            <BattleOverlayController 
                connection={connection}
            />
        </>
    );
}