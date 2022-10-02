import { defineSystem } from '@/utils';
import { createQuery, With } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import { BombC, ColorC, FlameC, PlayerC, PositionC, SizeC, WallC } from '../components';
import { clearColor } from '../constants';

const wallQ = createQuery([PositionC, ColorC, SizeC], With(WallC));
const bombQ = createQuery([PositionC, ColorC, SizeC], With(BombC));
const flameQ = createQuery([PositionC, ColorC, SizeC], With(FlameC));
const playerQ = createQuery([PositionC, ColorC, SizeC], With(PlayerC));

function draw(context: CanvasRenderingContext2D, color: string, pos: Vec2, width: number, height: number) {
  context.fillStyle = color;
  context.fillRect(pos.x, pos.y, width, height);
}

export const drawSystem = defineSystem(({ context, canvas, world }) => {
  draw(context, clearColor, new Vec2(0, 0), canvas.width, canvas.height);

  const query = [
    ...wallQ.exec(world), //
    ...bombQ.exec(world),
    ...flameQ.exec(world),
    ...playerQ.exec(world),
  ];

  for (const [pos, color, size] of query) {
    draw(context, color.value, pos.value, size.value, size.value);
  }
});
