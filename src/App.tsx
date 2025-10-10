import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { VGCOverlayApp } from "./components/vgc-overlay-app";
import { queryClient } from "./lib/query-client";
import { Toaster } from "./components/ui/toaster";
import { OBSConnectionProvider } from "./hooks/use-obs-connection";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OBSConnectionProvider>
        <VGCOverlayApp />
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </OBSConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
