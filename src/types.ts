import type { Component, MapQueryReturn, Query, World } from '@kadiryazici/ecs';
import type { KeyMap } from './composables/useKeyMap';

export interface GameState {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  delta: number;
  world: World;
  keys: KeyMap;
  onNextFrameStart: (fn: () => void) => () => void;
}

export type System = (state: GameState) => void;

export type GetQueryReturn<Q> = Q extends Query<infer T> ? MapQueryReturn<T>[] : never;
export type GetComponentState<C> = C extends Component<infer S> ? S : never;
