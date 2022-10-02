import { defineSystem, isColliding } from '@/utils';
import { createQuery, EntityId, Optional, With, Without } from '@kadiryazici/ecs';
import { WallC, FlameC, PlayerC, PositionC, SizeC, BombC } from '../components';

const flameQuery = createQuery([PositionC, SizeC], With(FlameC));
const playerAndCrackWallQuery = createQuery(
  [PositionC, SizeC, EntityId, Optional(PlayerC), Optional(WallC)],
  Without(FlameC, BombC),
);

export const flameSystem = defineSystem(({ world }) => {
  for (const [flamePos, flameSize] of flameQuery.exec(world)) {
    for (const [otherPos, otherSize, eid, _player] of playerAndCrackWallQuery.exec(world)) {
      const colliding = isColliding(flamePos.value, flameSize.value, otherPos.value, otherSize.value);
      if (colliding) {
        world.remove(eid);

        if (_player != null) {
          // TODO: GAME OVER
        }
      }
    }
  }
});
