import type {TimerModuleFactories, TimerModuleSingletons} from '../timer-logic';

type SingletonModules = TimerModuleSingletons;

type FactoryModules = TimerModuleFactories;

type Supervisor = {
  singletons: SingletonModules;
  factories: FactoryModules;

  getModuleFactory: <K extends keyof FactoryModules>(
    key: K,
  ) => FactoryModules[K];
  getSingleton: <K extends keyof SingletonModules>(
    key: K,
  ) => SingletonModules[K];

  registerModuleFactory<K extends keyof FactoryModules>(
    key: K,
    factory: FactoryModules[K],
  ): void;
  registerSingletonModule<K extends keyof SingletonModules>(
    key: K,
    module: SingletonModules[K],
  ): void;
};

export const supervisor: Supervisor = {
  // @ts-expect-error
  singletons: {},
  // @ts-expect-error
  factories: {},

  registerModuleFactory(key, factory) {
    this.factories[key] = factory;
  },
  registerSingletonModule(key, module) {
    this.singletons[key] = module;
  },

  getModuleFactory(key) {
    const factory = this.factories[key];
    if (!factory) {
      throw new Error('No factory for key `${key}` has been provided');
    }

    return factory;
  },

  getSingleton(key) {
    const module = this.singletons[key];
    if (!module) {
      throw new Error(`No module for key: "${key}" has been provided`);
    }

    return module;
  },
};
