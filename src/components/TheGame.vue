<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
import Vec2 from 'vec2';

import type { GameState } from '@/types';

import { LEVEL_1, PLAYER_SIZE, TileColor, TileType, TILE_SIZE, WallType } from '@/game/constants';
import { SizeC, PositionC, ColliderC, ColorC, VelocityC, WallC, PlayerC } from '@/game/components';
import { createEntity, createWorld } from '@kadiryazici/ecs';

import { useKeyMap } from '@/composables/useKeyMap';
import { drawSystem } from '@/game/systems/drawSystem';
import { inputSystem } from '@/game/systems/inputSystem';
import { physicsSystem } from '@/game/systems/physicsSystem';
import { bombSystem } from '@/game/systems/bombSystem';
import { timerSystem } from '@/game/systems/timerSystem';

const keyMap = useKeyMap();
const world = createWorld();
const canvas = ref<HTMLCanvasElement>();

let context: CanvasRenderingContext2D;
let delta = 0;
let lastTime = 0;

function loop(currentTime = 0) {
  requestAnimationFrame(loop);
  if (!canvas.value) return;

  delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  const frameEndHooks = new Set<() => void>();
  const state: GameState = {
    canvas: canvas.value,
    context,
    delta,
    world,
    keys: keyMap,
    onCurrentFrameEnd(fn) {
      frameEndHooks.add(fn);
      return () => frameEndHooks.delete(fn);
    },
  };

  timerSystem(state);
  inputSystem(state);
  physicsSystem(state);
  drawSystem(state);
  bombSystem(state);

  keyMap.nextKeysFrame();
  frameEndHooks.forEach((fn) => fn());
}

function setup() {
  keyMap.registerKeyHandler(' ', (e) => e.preventDefault());

  const { map, playerSpawnTile } = LEVEL_1;

  world.add(
    createEntity()
      .add(PlayerC.create())
      .add(ColorC.create({ value: TileColor[TileType.Player] }))
      .add(SizeC.create({ value: PLAYER_SIZE }))
      .add(VelocityC.create({ value: new Vec2(0, 0) }))
      .add(
        PositionC.create({
          value: new Vec2(
            playerSpawnTile.x * TILE_SIZE + TILE_SIZE / 2 - PLAYER_SIZE / 2,
            playerSpawnTile.y * TILE_SIZE + TILE_SIZE / 2 - PLAYER_SIZE / 2,
          ),
        }),
      ),
  );

  for (const y of map.keys()) {
    for (const x of map[y].keys()) {
      const tileType = map[y][x];

      if (tileType === TileType.SolidWall || tileType === TileType.CrackWall) {
        const entity = createEntity()
          .add(
            WallC.create({
              type: tileType === TileType.SolidWall ? WallType.Solid : WallType.Cracked,
            }),
          )
          .add(SizeC.create({ value: TILE_SIZE }))
          .add(ColliderC.create())
          .add(PositionC.create({ value: new Vec2(x * TILE_SIZE, y * TILE_SIZE) }))
          .add(ColorC.create({ value: TileColor[tileType] }));

        world.add(entity);
      }
    }
  }
}

watchEffect(() => {
  context ||= canvas.value?.getContext('2d')!;
});

onMounted(() => {
  setup();

  canvas.value!.width = LEVEL_1.map[0].length * TILE_SIZE;
  canvas.value!.height = LEVEL_1.map.length * TILE_SIZE;

  requestAnimationFrame(loop);
});
</script>

<template>
  <div id="game-canvas">
    <canvas ref="canvas" />
  </div>
</template>

<style lang="scss" scoped>
#game-canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;

  canvas {
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
