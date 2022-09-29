import { Singleton } from '@/decorators';
import { onScopeDispose } from 'vue';

type KeyState = [pressed: boolean, justPressed: boolean];

@Singleton
class KeyMap {
  private map = new Map<string, KeyState>();
  private registeredKeys = new Map<string, (e: KeyboardEvent) => void>();

  public registerKeyHandler(key: string, handler: (e: KeyboardEvent) => void) {
    this.registeredKeys.set(key, handler);
  }

  /**
   * Marks all keys `just_pressed` state as false.
   */
  public nextKeysFrame() {
    this.map.forEach((state) => {
      state[1] = false;
    });
  }

  public isJustPressed(key: string) {
    return this.map.get(key.toLowerCase())?.[1] || false;
  }

  public isPressed(key: string) {
    return this.map.get(key.toLowerCase())?.[0] || false;
  }

  public keydownHandler(e: KeyboardEvent) {
    this.registeredKeys.get(e.key)?.(e);

    if (this.map.has(e.key.toLowerCase())) return;

    this.map.set(e.key.toLowerCase(), [true, true]);
  }

  public keyupHandler(e: KeyboardEvent) {
    if (!this.map.has(e.key.toLowerCase())) return;
    this.map.delete(e.key.toLowerCase());
  }
}

export type { KeyMap };

export function useKeyMap() {
  const keyMap = new KeyMap();

  const keydownHandler = keyMap.keydownHandler.bind(keyMap);
  const keyupHandler = keyMap.keyupHandler.bind(keyMap);

  window.addEventListener('keydown', keydownHandler);
  window.addEventListener('keyup', keyupHandler);

  onScopeDispose(() => {
    window.removeEventListener('keydown', keydownHandler);
    window.removeEventListener('keyup', keyupHandler);
  });

  return keyMap;
}
