import { defineSystem } from '@/utils';
import { createEntity, createQuery, EntityId, With } from '@kadiryazici/ecs';
import { BombC, ColorC, FlameC, PositionC, SizeC, TimerC } from '../components';
import { TILE_SIZE } from '../constants';

const bombQuery = createQuery([TimerC, EntityId, PositionC], With(BombC));

export const bombSystem = defineSystem(({ world }) => {
  for (const [timer, eid, pos] of bombQuery.exec(world)) {
    if (timer.justFinished) {
      world.remove(eid);

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
            .add(ColorC.create({ value: 'rgb(255, 50, 50)' }))
            .add(PositionC.create({ value: pos }))
            .add(SizeC.create({ value: TILE_SIZE }))
            .add(FlameC.create())
            .add(
              TimerC.create({
                timeout: 1.0,
                removeEntityOnFinish: true,
                repeat: true,
              }),
            ),
        );
      });
    }
  }
});
