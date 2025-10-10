# OBS Integration Refactoring

## Overview

This refactoring introduces React Query for state management and creates a shared state system for OBS scenes and sources across all components.

## Key Changes

### 1. Created Shared State Hook (`use-obs-state.ts`)

- **React Query Integration**: All OBS data fetching now uses React Query for better caching, error handling, and automatic refetching
- **Shared State Management**: Scene and source selection state is now shared across all components using React Query's client cache
- **Automatic State Synchronization**: When a scene is selected, the source selection is automatically cleared
- **Error Handling**: Proper error states and loading indicators for all async operations

### 2. Updated Components

#### OBSSceneSelector

- Removed local state management
- Now uses shared state from `useOBSState` hook
- Added refresh button with loading indicator
- Improved error handling and display

#### OBSSourceController

- Removed local state management and useEffect dependencies
- Now uses shared state from `useOBSState` hook
- Enhanced loading states for URL updates
- Better error handling and user feedback
- Automatically hides when no scene is selected

#### OBSController

- Simplified component by removing local state
- Components now manage their own state through shared hooks
- Cleaner, more maintainable code

### 3. Benefits

- **Better UX**: Consistent state across components, no more sync issues
- **Performance**: React Query caching reduces unnecessary API calls
- **Error Handling**: Centralized error handling with user-friendly messages
- **Maintainability**: Shared state logic makes it easier to add new features
- **Type Safety**: Strong typing throughout the state management system

## Usage

Components automatically sync their state:

1. Select a scene in the Scene Selector
2. The Source Controller automatically loads sources for that scene
3. Source selection is preserved per scene
4. All state is shared across component instances

## API

### useOBSState(connection)

Returns an object with:

- `scenes`, `sources` - Current data arrays
- `scenesLoading`, `sourcesLoading` - Loading states
- `scenesError`, `sourcesError` - Error states
- `selectedScene`, `selectedSource` - Current selections
- `setSelectedScene`, `setSelectedSource` - State setters
- `updateSourceUrl` - Mutation function for URL updates
- `refetchScenes`, `refetchSources` - Manual refetch functions

### Individual Hooks

- `useSelectedScene()` - Scene selection state
- `useSelectedSource()` - Source selection state
- `useOBSScenes(connection)` - Scenes data query
- `useOBSSources(connection, sceneName)` - Sources data query
- `useUpdateSourceUrl(connection)` - URL update mutation
