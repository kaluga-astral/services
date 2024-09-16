import { makeAutoObservable, runInAction } from 'mobx';

import type {
  FeatureFlagExperiment,
  FeatureFlagProductionReady,
  FeatureFlagsConfig,
  FeatureFlagsSources,
  TriggerRefreshData,
} from './types';

export class FeatureFlagsStore<
  TKeyProductionReady extends string,
  TKeyForExperiment extends string,
  TEventType,
> {
  // Статический метод не может ссылаться на параметры типа класса
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instance: FeatureFlagsStore<any, any, any> | null = null;

  private cacheProductionReady: Record<TKeyProductionReady, boolean>;

  private cacheForExperiment: Record<TKeyForExperiment, string>;

  constructor(
    private readonly featureFlagsConfig: FeatureFlagsConfig<
      TKeyProductionReady,
      TKeyForExperiment,
      TEventType
    >,
    private readonly featureFlagsSources: FeatureFlagsSources<
      TKeyProductionReady,
      TKeyForExperiment,
      TEventType
    >,
  ) {
    this.cacheProductionReady = this.initCache<
      TKeyProductionReady,
      FeatureFlagProductionReady<TKeyProductionReady>,
      boolean
    >(this.featureFlagsConfig.booleanFeatureFlags);

    this.cacheForExperiment = this.initCache<
      TKeyForExperiment,
      FeatureFlagExperiment<TKeyForExperiment, TEventType>,
      string
    >(this.featureFlagsConfig.stringFeatureFlags);

    makeAutoObservable(this);
  }

  private initCache<
    TKey extends string,
    TValue extends { flagKey: TKey; defaultValue: TCacheValue },
    TCacheValue,
  >(featureFlags?: Record<TKey, TValue>): Record<TKey, TCacheValue> {
    const featureFlagsObject = {} as Record<TKey, TCacheValue>;

    if (!featureFlags) {
      return featureFlagsObject;
    }

    Object.values<TValue>(featureFlags).forEach((flag) => {
      featureFlagsObject[flag.flagKey as TKey] = flag.defaultValue;
    });

    return featureFlagsObject;
  }

  private fetchFlagList = async (): Promise<void> => {
    if (this.featureFlagsConfig.booleanFeatureFlags) {
      this.featureFlagsSources
        .getBooleanFlagList(
          Object.keys(
            this.featureFlagsConfig.booleanFeatureFlags,
          ) as TKeyProductionReady[],
        )
        .then((result) => {
          runInAction(() => {
            this.cacheProductionReady = {
              ...this.cacheProductionReady,
              ...result.data.value,
            };
          });
        });
    }

    if (this.featureFlagsConfig.stringFeatureFlags) {
      this.featureFlagsSources
        .getStringFlagList(
          Object.keys(
            this.featureFlagsConfig.stringFeatureFlags,
          ) as TKeyForExperiment[],
        )
        .then((result) => {
          runInAction(() => {
            this.cacheForExperiment = {
              ...this.cacheForExperiment,
              ...result.data.value,
            };
          });
        });
    }
  };

  public init = (triggerRefreshData: TriggerRefreshData) => {
    this.fetchFlagList();
    triggerRefreshData(this.fetchFlagList);
  };

  /**
   * Карта флагов для сокрытия функциональности,
   * находящейся на ранних стадиях разработки,
   * не готовой для показа на широкую аудиторию
   */
  public get productionReady() {
    return this.cacheProductionReady;
  }

  /**
   * Карта флагов для A/B/n тестирования
   */
  public get experiments() {
    if (!this.featureFlagsConfig.stringFeatureFlags) {
      console.warn(
        'FeatureFlags: флаги для проведения A/B/n тестирования не зарегистрированы',
      );

      return {
        flags: null,
        track: () => {},
      };
    }

    const cache = this.cacheForExperiment;
    const flags = {} as Record<TKeyForExperiment, string>;

    (
      Object.entries(this.featureFlagsConfig.stringFeatureFlags) as [
        TKeyForExperiment,
        FeatureFlagExperiment<TKeyForExperiment, TEventType>,
      ][]
    ).forEach(([key, value]) => {
      flags[key] =
        cache[key] !== undefined &&
        cache[key] !== this.featureFlagsConfig.defaultStringValue
          ? cache[key]
          : value.defaultValue;
    });

    return {
      flags,
      /**
       * Отправка целевого события для вычисления конверсии
       * @param eventType Событие, которое совершил пользователь
       * при взаимодействии с одним из вариантов функциональности
       */
      track: (eventType: TEventType) => {
        if (eventType) {
          this.featureFlagsSources.track(eventType);
        } else {
          console.warn(
            'FeatureFlags: eventType обязателен для проведения A/B/n тестирования',
          );
        }
      },
    };
  }

  public static getInstance<
    TKeyProductionReady extends string,
    TKeyForExperiment extends string,
    TEventType,
  >(
    featureFlagsConfig: FeatureFlagsConfig<
      TKeyProductionReady,
      TKeyForExperiment,
      TEventType
    >,
    featureFlagsSources: FeatureFlagsSources<
      TKeyProductionReady,
      TKeyForExperiment,
      TEventType
    >,
  ) {
    if (!FeatureFlagsStore.instance) {
      FeatureFlagsStore.instance = new FeatureFlagsStore(
        featureFlagsConfig,
        featureFlagsSources,
      );
    }

    return FeatureFlagsStore.instance as FeatureFlagsStore<
      TKeyProductionReady,
      TKeyForExperiment,
      TEventType
    >;
  }
}

export const createFeatureFlagsStore = <
  TKeyProductionReady extends string,
  TKeyForExperiment extends string,
  TEventType,
>(
  featureFlagsConfig: FeatureFlagsConfig<
    TKeyProductionReady,
    TKeyForExperiment,
    TEventType
  >,
  featureFlagsSources: FeatureFlagsSources<
    TKeyProductionReady,
    TKeyForExperiment,
    TEventType
  >,
) =>
  FeatureFlagsStore.getInstance<
    TKeyProductionReady,
    TKeyForExperiment,
    TEventType
  >(featureFlagsConfig, featureFlagsSources);
