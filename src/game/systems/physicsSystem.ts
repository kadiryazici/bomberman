import { defineSystem, isColliding } from '@/utils';
import { createQuery, With } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import { ColliderC, PlayerC, PositionC, SizeC, VelocityC } from '../components';

const playerQ = createQuery([PositionC, VelocityC, SizeC], With(PlayerC));
const colliderQ = createQuery([PositionC, SizeC], With(ColliderC));

export const physicsSystem = defineSystem(({ world, delta }) => {
  const players = playerQ.exec(world);
  const colliders = colliderQ.exec(world);

  for (const [playerPos, playerVel, playerSize] of players) {
    const nextPlayerPos = playerPos.value.clone().add(playerVel.value.x * delta, playerVel.value.y * delta);

    for (const [colliderPos, colliderSize] of colliders) {
      // If is colliding currently, let player move instead of make it stuck
      if (isColliding(playerPos.value, playerSize.value, colliderPos.value, colliderSize.value)) {
        continue;
      }

      // If next X position is not colliding.
      if (
        isColliding(
          new Vec2(nextPlayerPos.x, playerPos.value.y), //
          playerSize.value,
          colliderPos.value,
          colliderSize.value,
        )
      ) {
        nextPlayerPos.x = playerPos.value.x;
      }

      // If next Y position is not colliding.
      if (
        isColliding(
          new Vec2(playerPos.value.x, nextPlayerPos.y), //
          playerSize.value,
          colliderPos.value,
          colliderSize.value,
        )
      ) {
        nextPlayerPos.y = playerPos.value.y;
      }
    }

    playerPos.value = nextPlayerPos;
  }
});
