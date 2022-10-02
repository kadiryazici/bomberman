import { center, defineSystem } from '@/utils';
import { createEntity, createQuery, With } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import { BombC, ColliderC, ColorC, PlayerC, PositionC, SizeC, TimerC, VelocityC } from '../components';
import { PLAYER_SPEED, TILE_SIZE } from '../constants';

const playerVelocityQuery = createQuery([VelocityC, PositionC, SizeC], With(PlayerC));
const bombQuery = createQuery([PositionC], With(BombC));

export const inputSystem = defineSystem(({ world, keys }) => {
  const query = playerVelocityQuery.exec(world);
  const bombs = bombQuery.exec(world);

  for (const [velocity, position, size] of query) {
    if (keys.isJustPressed(' ')) {
      const centerPos = center(position.value, size.value, size.value);
      const tilePos = new Vec2(
        Math.floor(centerPos.x / TILE_SIZE) * TILE_SIZE, //
        Math.floor(centerPos.y / TILE_SIZE) * TILE_SIZE,
      );

      const bombExistsOntile = bombs.some(([pos]) => pos.value.equal(tilePos));

      if (!bombExistsOntile) {
        world.add(
          createEntity()
            .add(BombC.create())
            .add(ColorC.create({ value: 'rgb(255, 0, 0)' }))
            .add(PositionC.create({ value: tilePos }))
            .add(SizeC.create({ value: TILE_SIZE }))
            .add(TimerC.create({ timeout: 2.0 }))
            .add(ColliderC.create()),
        );
      }
    }

    const nextVelocity = new Vec2(0, 0);

    if (
      (keys.isPressed('A') || keys.isPressed('ArrowLeft')) &&
      !(keys.isPressed('D') || keys.isPressed('ArrowRight'))
    ) {
      nextVelocity.x = -1;
    } else if (
      (keys.isPressed('D') || keys.isPressed('ArrowRight')) &&
      !(keys.isPressed('A') || keys.isPressed('ArrowLeft'))
    ) {
      nextVelocity.x = 1;
    }

    if ((keys.isPressed('S') || keys.isPressed('ArrowDown')) && !(keys.isPressed('W') || keys.isPressed('ArrowUp'))) {
      nextVelocity.y = 1;
    } else if (
      (keys.isPressed('W') || keys.isPressed('ArrowUp')) &&
      !(keys.isPressed('S') || keys.isPressed('ArrowDown'))
    ) {
      nextVelocity.y = -1;
    }

    nextVelocity.normalize();

    velocity.value.x = Math.floor(nextVelocity.x * PLAYER_SPEED);
    velocity.value.y = Math.floor(nextVelocity.y * PLAYER_SPEED);
  }
});
