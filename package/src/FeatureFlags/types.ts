export type FeatureFlagsResponse<
  TOutput = { value: Record<string, string | boolean> },
> = {
  data: TOutput;
};

export type FeatureFlagExperiment<
  TKeyForExperiment extends string,
  TEventType,
> = {
  flagKey: TKeyForExperiment;
  defaultValue: keyof FeatureFlagExperiment<
    TKeyForExperiment,
    TEventType
  >['variants'];
  variants: Record<string, string>;
  eventType: TEventType;
};

export type FeatureFlagProductionReady<TKeyProductionReady extends string> = {
  flagKey: TKeyProductionReady;
  defaultValue: boolean;
};

export type BooleanFeatureFlagsMap<TKeyProductionReady extends string> = {
  [key in TKeyProductionReady]: FeatureFlagProductionReady<TKeyProductionReady>;
};

export type StringFeatureFlagsMap<
  TKeyForExperiment extends string,
  TEventType,
> = {
  [key in TKeyForExperiment]: FeatureFlagExperiment<
    TKeyForExperiment,
    TEventType
  >;
};

export type FeatureFlagsSources<
  TKeyProductionReady extends string,
  TKeyForExperiment extends string,
  TEventType,
> = {
  getStringFlagList: (
    stringFlagList: TKeyForExperiment[],
  ) => Promise<
    FeatureFlagsResponse<{ value: Record<TKeyForExperiment, string> }>
  >;
  getBooleanFlagList: (
    booleanFlagList: TKeyProductionReady[],
  ) => Promise<
    FeatureFlagsResponse<{ value: Record<TKeyProductionReady, boolean> }>
  >;
  track: (eventType: TEventType) => void;
};

export type FeatureFlagsConfig<
  TKeyProductionReady extends string,
  TKeyForExperiment extends string,
  TEventType,
> = {
  booleanFeatureFlags?: BooleanFeatureFlagsMap<TKeyProductionReady>;
  stringFeatureFlags?: StringFeatureFlagsMap<TKeyForExperiment, TEventType>;
  defaultStringValue: string;
};

type Callback = () => void;

export type TriggerRefreshData = (callback: Callback) => void;
