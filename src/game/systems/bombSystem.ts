import type { GetQueryReturn } from '@/types';
import { defineSystem, isColliding } from '@/utils';
import { createEntity, createQuery, EntityId, Optional } from '@kadiryazici/ecs';
import Vec2 from 'vec2';
import { BombC, ColorC, FlameC, PlayerC, PositionC, SizeC, TimerC, WallC } from '../components';
import { TileType, TILE_SIZE, WallType } from '../constants';

const bombQuery = createQuery([TimerC, EntityId, PositionC, BombC]);
const WallsAndPlayersQuery = createQuery([PositionC, SizeC, Optional(PlayerC), Optional(WallC)]);

function getCollideType(
  query: GetQueryReturn<typeof WallsAndPlayersQuery>, //
  pos: Vec2,
  size: number,
) {
  for (const [queryPos, querySize, player, wall] of query) {
    if (isColliding(queryPos.value, querySize.value, pos, size)) {
      if (player != null) return TileType.Player;
      if (wall != null) return wall.type === WallType.Cracked ? TileType.CrackWall : TileType.SolidWall;
    }
  }

  return TileType.None;
}

export const bombSystem = defineSystem(({ world }) => {
  const wallsAndPlayers = WallsAndPlayersQuery.exec(world);

  for (const [timer, eid, pos, { flameSize }] of bombQuery.exec(world)) {
    if (timer.justFinished) {
      world.remove(eid);

      const topPoints: Vec2[] = [];
      const bottomPoints: Vec2[] = [];
      const leftPoints: Vec2[] = [];
      const rightPoints: Vec2[] = [];

      for (let i = 1; i <= flameSize; i++) {
        topPoints.push(new Vec2(pos.value.x, pos.value.y - i * TILE_SIZE));
        bottomPoints.push(new Vec2(pos.value.x, pos.value.y + i * TILE_SIZE));
        leftPoints.push(new Vec2(pos.value.x - i * TILE_SIZE, pos.value.y));
        rightPoints.push(new Vec2(pos.value.x + i * TILE_SIZE, pos.value.y));
      }

      const pointsList = [
        topPoints, //
        bottomPoints,
        leftPoints,
        rightPoints,
        [pos.value.clone()],
      ];

      for (const points of pointsList) {
        inner: for (const point of points) {
          const collideType = getCollideType(wallsAndPlayers, point, TILE_SIZE);
          if (collideType === TileType.SolidWall) break inner;

          world.add(
            createEntity()
              .add(ColorC.create({ value: 'rgb(255, 50, 50)' }))
              .add(PositionC.create({ value: point }))
              .add(SizeC.create({ value: TILE_SIZE }))
              .add(FlameC.create())
              .add(
                TimerC.create({
                  timeout: 1.0,
                  removeEntityOnFinish: true,
                }),
              ),
          );

          if (collideType === TileType.CrackWall) break inner;
        }
      }
    }
  }
});
