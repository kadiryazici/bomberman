export function Singleton<T extends new (...args: any[]) => any>(constructor: T) {
  let instance: any = null;

  return function (...args: any[]) {
    instance ||= new constructor(...args);
    return instance;
  } as unknown as T;
}
