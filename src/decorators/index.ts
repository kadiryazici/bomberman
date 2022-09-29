export function Singleton<T extends new (...args: any[]) => any>(constructor: T) {
  let instance: unknown = null;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this;
    }
  };
}
