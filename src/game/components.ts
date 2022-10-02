import { defineComponent } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import { WallType } from './constants';

export const FlameC = defineComponent();
export const ColliderC = defineComponent();
export const PlayerC = defineComponent();

export const BombC = defineComponent(() => ({ flameSize: 1 }));
export const SizeC = defineComponent(() => ({ value: 0 }));
export const PositionC = defineComponent(() => ({ value: new Vec2(0, 0) }));
export const ColorC = defineComponent(() => ({ value: '' }));
export const VelocityC = defineComponent(() => ({ value: new Vec2(0, 0) }));
export const WallC = defineComponent(() => ({ type: WallType.Solid }));
export const TimerC = defineComponent(() => ({
  timeout: 0,
  current: 0,
  finished: false,
  justFinished: false,
  repeat: false,
  removeEntityOnFinish: false,
}));
