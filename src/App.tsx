import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { VGCOverlayApp } from "./components/vgc-overlay-app";
import { queryClient } from "./lib/query-client";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Route, Routes } from "react-router";
import { TeamPreviewOBSRenderer } from "./components/team-preview-obs-renderer";
import { OBSConnectionProvider } from "./hooks/use-obs-connection";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OBSConnectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<VGCOverlayApp />} />
            <Route
              path="/teamlist/:pokepaste"
              element={<TeamPreviewOBSRenderer />}
            />
          </Routes>
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </OBSConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;
