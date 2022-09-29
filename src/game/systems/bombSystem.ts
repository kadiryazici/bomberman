import { defineSystem } from '@/utils';
import { createEntity, createQuery, EntityId, With } from '@kadiryazici/ecs';
import { BombC, ColorC, PositionC, SizeC, TimerC } from '../components';
import { TILE_SIZE } from '../constants';

const bombQuery = createQuery([TimerC, EntityId, PositionC], With(BombC));

export const bombSystem = defineSystem(({ world, delta }) => {
  for (const [timer, eid, pos] of bombQuery.exec(world)) {
    timer.current += delta;

    if (timer.current >= timer.timeout) {
      world.remove(eid);

      if (timer.particle) continue;

      const points = [
        pos.value.clone(),
        pos.value.clone().add(TILE_SIZE, 0),
        pos.value.clone().add(-TILE_SIZE, 0),
        pos.value.clone().add(0, TILE_SIZE),
        pos.value.clone().add(0, -TILE_SIZE),
      ];

      points.forEach((pos) => {
        world.add(
          createEntity()
            .add(BombC.create())
            .add(ColorC.create({ value: 'rgb(255, 50, 50)' }))
            .add(PositionC.create({ value: pos }))
            .add(SizeC.create({ value: TILE_SIZE }))
            .add(TimerC.create({ timeout: 1.0, particle: true })),
        );
      });
    }
  }
});
