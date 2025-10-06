import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OBSConnectionController } from "../components/obs/OBSConnectionController";

export const OBSRemoteController = () => {
    const queryClient = new QueryClient();

    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <OBSConnectionController />
            </QueryClientProvider>
        </div>
    )
}