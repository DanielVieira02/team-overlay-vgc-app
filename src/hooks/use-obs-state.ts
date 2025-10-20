import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { OBSConnection } from "@/src/lib/obs-connection";
import { eventNames } from "process";

// Types for OBS data
interface OBSScene {
  sceneName: string;
  sceneIndex: number;
}

interface OBSSource {
  sourceName: string;
  sourceType: string;
  sourceKind: string;
}

// Scene management hooks
export function useOBSScenes(connection: OBSConnection | null) {
  return useQuery({
    queryKey: ["obs-scenes"],
    queryFn: async (): Promise<OBSScene[]> => {
      if (!connection) return [];
      return await connection.getScenes();
    },
    enabled: !!connection,
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
  });
}

// Sources management hooks
export function useOBSSources(
  connection: OBSConnection | null,
  sceneName: string | undefined,
) {
  return useQuery({
    queryKey: ["obs-sources", sceneName],
    queryFn: async (): Promise<OBSSource[]> => {
      if (!connection || !sceneName) return [];
      return await connection.getSources(sceneName);
    },
    enabled: !!connection && !!sceneName,
    staleTime: 30000, // 30 seconds
    refetchOnMount: true,
  });
}

// URL mutation hook
export function useUpdateSourceUrl(connection: OBSConnection | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sourceName,
      url,
    }: {
      sourceName: string;
      url: string;
    }) => {
      if (!connection) throw new Error("No OBS connection");
      return await connection.setSourceUrl(sourceName, url);
    },
    onSuccess: () => {
      // Optionally refetch sources if needed
      queryClient.invalidateQueries({ queryKey: ["obs-sources"] });
    },
  });
}

export function useBroadcastCustomEvent(connection: OBSConnection | null) {
  return useMutation({
    mutationFn: async ({
      eventName,
    }: {
      eventName: string;
    }) => {
      if (!connection) throw new Error("No OBS connection");
      return await connection.broadcastCustomEvent(eventName);
    }
  });
}

export function useAddEventListener(connection: OBSConnection | null, eventName: string, eventHandler: Function) {
  if (!connection) throw new Error("No OBS connection");
  connection.addEventListener(eventName, eventHandler);
}

export function useRemoveEventListener(connection: OBSConnection | null, eventName: string, eventHandler: Function) {
  if (!connection) throw new Error("No OBS connection");
  connection.removeEventListener(eventName, eventHandler);
}

// Shared selection state using React Query with reactive updates
export function useSelectedScene() {
  const queryClient = useQueryClient();

  // Create a query for the selected scene state
  const { data: selectedScene } = useQuery({
    queryKey: ["selected-scene"],
    queryFn: () => undefined as string | undefined,
    initialData: undefined,
    staleTime: Infinity,
  });

  const setSelectedScene = (scene: string | undefined) => {
    queryClient.setQueryData(["selected-scene"], scene);
    // Clear selected source when scene changes
    if (scene !== selectedScene) {
      queryClient.setQueryData(["selected-source"], undefined);
    }
  };

  return [selectedScene, setSelectedScene] as const;
}

export function useSelectedSource() {
  const queryClient = useQueryClient();

  // Create a query for the selected source state
  const { data: selectedSource } = useQuery({
    queryKey: ["selected-source"],
    queryFn: () => undefined as string | undefined,
    initialData: undefined,
    staleTime: Infinity,
  });

  const setSelectedSource = (source: string | undefined) => {
    queryClient.setQueryData(["selected-source"], source);
  };

  return [selectedSource, setSelectedSource] as const;
}

// Persistent source assignments across scenes
export function useSourceAssignments() {
  const queryClient = useQueryClient();

  // Create a query for source assignments (scene -> source -> playerId)
  const { data: sourceAssignments = {} } = useQuery({
    queryKey: ["source-assignments"],
    queryFn: () => ({}) as Record<string, Record<string, string>>,
    initialData: {},
    staleTime: Infinity,
  });

  const setSourceAssignment = (
    sceneName: string,
    sourceName: string,
    playerId: string | undefined,
  ) => {
    queryClient.setQueryData(
      ["source-assignments"],
      (prev: Record<string, Record<string, string>> = {}) => {
        const newAssignments = { ...prev };

        if (!newAssignments[sceneName]) {
          newAssignments[sceneName] = {};
        }

        if (playerId) {
          newAssignments[sceneName][sourceName] = playerId;
        } else {
          delete newAssignments[sceneName][sourceName];
          // Clean up empty scenes
          if (Object.keys(newAssignments[sceneName]).length === 0) {
            delete newAssignments[sceneName];
          }
        }

        return newAssignments;
      },
    );
  };

  const getSceneAssignments = (sceneName: string): Record<string, string> => {
    return sourceAssignments[sceneName] || {};
  };

  return {
    sourceAssignments,
    setSourceAssignment,
    getSceneAssignments,
  };
}

// Combined hook for easier usage
export function useOBSState(connection: OBSConnection | null) {
  const [selectedScene, setSelectedScene] = useSelectedScene();
  const [selectedSource, setSelectedSource] = useSelectedSource();
  const { sourceAssignments, setSourceAssignment, getSceneAssignments } =
    useSourceAssignments();

  const scenesQuery = useOBSScenes(connection);
  const sourcesQuery = useOBSSources(connection, selectedScene);
  const updateUrlMutation = useUpdateSourceUrl(connection);
  const broadcastCustomEvent = useBroadcastCustomEvent(connection);

  const addEventListener = useAddEventListener;
  const removeEventListener = useRemoveEventListener;

  return {
    // Data
    scenes: scenesQuery.data ?? [],
    sources: sourcesQuery.data ?? [],

    // Loading states
    scenesLoading: scenesQuery.isLoading,
    sourcesLoading: sourcesQuery.isLoading,

    // Error states
    scenesError: scenesQuery.error,
    sourcesError: sourcesQuery.error,

    // Selected state
    selectedScene,
    selectedSource,
    setSelectedScene,
    setSelectedSource,

    // Source assignments
    sourceAssignments,
    setSourceAssignment,
    getSceneAssignments,

    // Mutations
    updateSourceUrl: updateUrlMutation.mutate,
    broadcastCustomEvent: broadcastCustomEvent.mutate,    
    isUpdatingUrl: updateUrlMutation.isPending,
    updateUrlError: updateUrlMutation.error,

    // Refetch functions
    refetchScenes: scenesQuery.refetch,
    refetchSources: sourcesQuery.refetch,

    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
  };
}
