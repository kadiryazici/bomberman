import { defineSystem } from '@/utils';
import { createQuery, EntityId } from '@kadiryazici/ecs';
import { TimerC } from '../components';

const timerQuery = createQuery([TimerC, EntityId]);

export const timerSystem = defineSystem(({ world, delta, onCurrentFrameEnd }) => {
  for (const [timer, eid] of timerQuery.exec(world)) {
    if (timer.finished) continue;

    timer.current += delta;

    if (timer.current >= timer.timeout) {
      timer.finished = true;
      timer.justFinished = true;

      if (timer.removeEntityOnFinish) {
        world.remove(eid);
      } else {
        onCurrentFrameEnd(() => {
          timer.justFinished = false;
          if (timer.repeat) {
            timer.current = 0;
            timer.finished = false;
          }
        });
      }
    }
  }
});
