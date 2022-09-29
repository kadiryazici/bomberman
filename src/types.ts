import type { World } from '@kadiryazici/ecs';
import type { KeyMap } from './composables/useKeyMap';

export interface GameState {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  delta: number;
  world: World;
  keys: KeyMap;
  onCurrentFrameEnd: (fn: () => void) => () => void;
}

export type System = (state: GameState) => void;
