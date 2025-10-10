import { OBSConnection } from "@/src/lib/obs-connection";
import { useToast } from "@/src/hooks/use-toast";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

type OBSConnectionContextType = {
  connection: OBSConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (url: string, password?: string) => Promise<void>;
  disconnect: () => Promise<void>;
};

const ObsConnectionContext = createContext<
  OBSConnectionContextType | undefined
>(undefined);

export function OBSConnectionProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<OBSConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(
    async (url: string, password?: string) => {
      setIsConnecting(true);
      try {
        const obs = new OBSConnection();
        await obs.connect(url, password);
        setConnection(obs);
        toast({
          title: "Connected to OBS",
          description: "Successfully connected to OBS WebSocket",
        });
      } catch (error: any) {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect to OBS",
          variant: "destructive",
        });
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [toast],
  );

  const disconnect = useCallback(async () => {
    if (connection) {
      await connection.disconnect();
      setConnection(null);
      toast({
        title: "Disconnected",
        description: "Disconnected from OBS",
      });
    }
  }, [connection, toast]);

  const value = useMemo(
    () => ({
      connection,
      isConnected: connection?.isConnected() ?? false,
      isConnecting,
      connect,
      disconnect,
    }),
    [connection, isConnecting, connect, disconnect],
  );

  return (
    <ObsConnectionContext.Provider value={value}>
      {children}
    </ObsConnectionContext.Provider>
  );
}

export function useOBSConnection() {
  const context = useContext(ObsConnectionContext);

  if (context === undefined) {
    throw new Error(
      "useOBSConnection must be used within an OBSConnectionProvider",
    );
  }

  return context;
}
