import { useOBSConnection } from "@/src/hooks/use-obs-connection";
import { BattleManagerController } from "./BattleManagerController";

export const BattleManager = () => {
    const { connection, isConnected } = useOBSConnection();

    if(!isConnected || !connection) {
        return (<></>);
    }

    return (
        <BattleManagerController connection={connection} />
    );
}