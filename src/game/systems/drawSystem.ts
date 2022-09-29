import { defineSystem } from '@/utils';
import { createQuery, With, Without } from '@kadiryazici/ecs';
import { ColorC, PlayerC, PositionC, SizeC } from '../components';
import { clearColor } from '../constants';

const nonPlayerQ = createQuery([PositionC, ColorC, SizeC], Without(PlayerC));
const playerQ = createQuery([PositionC, ColorC, SizeC], With(PlayerC));

export const drawSystem = defineSystem(({ context, canvas, world }) => {
  context.fillStyle = clearColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const [pos, color, size] of nonPlayerQ.exec(world)) {
    context.fillStyle = color.value;
    context.fillRect(pos.value.x, pos.value.y, size.value, size.value);
  }

  for (const [pos, color, size] of playerQ.exec(world)) {
    context.fillStyle = color.value;
    context.fillRect(pos.value.x, pos.value.y, size.value, size.value);
  }
});
