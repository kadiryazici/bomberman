import Vec2 from 'vec2';

export const TILE_SIZE = 75;
export const PLAYER_SIZE = 40;
export const PLAYER_SPEED = 200;

export const enum TileType {
  Player = 'P',
  SolidWall = '@',
  CrackWall = 'X',
  None = ' ',
}

export const enum WallType {
  Cracked,
  Solid,
}

export const TileColor = {
  [TileType.SolidWall]: '#707070',
  [TileType.Player]: 'rgb(200, 200, 200)',
  [TileType.CrackWall]: '#2e7f00',
  [TileType.None]: 'rgb(0, 0, 0)',
};

export const clearColor = TileColor[TileType.None];

export const LEVEL_1 = {
  playerSpawnTile: new Vec2(1, 1),
  map: [
    ['@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@'],
    ['@', ' ', ' ', 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '@'],
    ['@', ' ', '@', ' ', '@', ' ', '@', ' ', '@', ' ', '@', ' ', '@'],
    ['@', ' ', 'X', ' ', 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '@'],
    ['@', ' ', '@', ' ', '@', ' ', '@', ' ', '@', ' ', '@', ' ', '@'],
    ['@', ' ', 'X', 'X', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '@'],
    ['@', ' ', '@', ' ', '@', ' ', '@', 'X', '@', 'X', '@', 'X', '@'],
    ['@', ' ', ' ', ' ', ' ', ' ', ' ', 'X', ' ', ' ', ' ', 'X', '@'],
    ['@', ' ', '@', ' ', '@', ' ', '@', 'X', '@', 'X', '@', ' ', '@'],
    ['@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@', '@'],
  ] as TileType[][],
};
