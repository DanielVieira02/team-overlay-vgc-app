export interface Player {
  id: string
  name: string
  teamUrl: string
  createdAt: Date
}

export interface Pokemon {
  name: string
  species: string
  item?: string
  ability?: string
  level?: number
  shiny?: boolean
  gender?: string
  nature?: string
  evs?: Record<string, number>
  ivs?: Record<string, number>
  moves?: string[]
  teraType?: string
}

export interface OBSScene {
  sceneName: string
  sceneIndex: number
}

export interface OBSSource {
  sourceName: string
  sourceKind: string
  inputKind?: string
}

export interface OBSConnectionConfig {
  url: string
  password?: string
}
