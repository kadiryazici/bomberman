import { defineComponent } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import type { WallType } from './constants';

export const FlameC = defineComponent();
export const ColliderC = defineComponent();
export const PlayerC = defineComponent();
export const BombC = defineComponent();

export const SizeC = defineComponent({ value: 0 });
export const PositionC = defineComponent({ value: new Vec2(0, 0) });
export const ColorC = defineComponent({ value: '', defaultColor: '' });
export const VelocityC = defineComponent({ value: new Vec2(0, 0) });
export const WallC = defineComponent({
  type: null as WallType | null,
});
export const TimerC = defineComponent({
  timeout: 0,
  current: 0,
  particle: false,
});
