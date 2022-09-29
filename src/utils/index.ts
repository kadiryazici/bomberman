import type { System } from '@/types';
import Vec2 from 'vec2';

export function isColliding(a: Vec2, aSize: number, b: Vec2, bSize: number) {
  return (
    a.x < b.x + bSize && //
    a.x + aSize > b.x &&
    a.y < b.y + bSize &&
    a.y + aSize > b.y
  );
}

export function defineSystem(fn: System) {
  return fn;
}

export function center(vec: Vec2, width: number, height: number) {
  return new Vec2(vec.x + width / 2, vec.y + height / 2);
}
