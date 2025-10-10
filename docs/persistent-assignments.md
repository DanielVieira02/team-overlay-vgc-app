# Persistent Source Assignments

## Data Structure

The source assignments are now stored persistently across scenes using this structure:

```typescript
{
  "Scene 1": {
    "Player 1 Overlay": "player-uuid-1",
    "Player 2 Overlay": "player-uuid-2"
  },
  "Scene 2": {
    "Commentary Overlay": "player-uuid-3",
    "Player 1 Overlay": "player-uuid-1"
  }
}
```

## How It Works

1. **Scene Selection**: When you select a scene, it loads the assignments for that specific scene
2. **Persistent Storage**: Assignments are stored in React Query's cache, persisting across scene changes
3. **Independent Scenes**: Each scene maintains its own set of source assignments
4. **Automatic Cleanup**: Empty scenes (no assignments) are automatically cleaned up

## User Experience

- ✅ Switch between scenes and assignments are preserved
- ✅ Each scene can have different player assignments
- ✅ No need to reassign players when switching scenes
- ✅ Immediate UI feedback with error recovery
- ✅ Clean state management with automatic cleanup

## Example Usage

1. **Scene "Main Stream"**: Assign Player A to "Player 1 Overlay"
2. **Switch to Scene "Commentary"**: Assign Player B to "Commentary Overlay"
3. **Switch back to Scene "Main Stream"**: Player A is still assigned to "Player 1 Overlay"
4. **Clear assignments**: Remove Player A, assignment is cleared for this scene only

This provides a much better user experience where scene-specific configurations are maintained!
