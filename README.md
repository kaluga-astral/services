# @astral/services

Shared js-сервисы.

----

## UserAgentDetector

UserAgentDetector — сервис парсинга строки User-Agent браузера для получения информацию о
текущей ОС, браузере и версии браузера пользователя.

#### Использование

```typescript
import { 
  Browser, 
  OperatingSystem, 
  type UserAgentDetector,
  userAgentDetector as userAgentDetectorInstance, 
} from '@astral/services';

export class UIStore {
  constructor(private readonly userAgentDetector: UserAgentDetector) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isOsSupported() {
    return this.userAgentDetector.os === OperatingSystem.Windows;
  }

  public get browserName() {
    return this.userAgentDetector.browser; // Browser.Chrome === 'Chrome'
  }

  public get browserVersion() {
    return this.userAgentDetector.browserVersion; // 91.0.4472.124
  }
}

export const createUIStore = () => new UIStore(userAgentDetectorInstance);
```

#### Перечисления

`OperatingSystem`:
- `Windows` = 'Windows',
- `MacOS` = 'macOS',
- `Unix` = 'Unix', // В т.ч. Linux, CentOS, Debian, Mint, RedHat, Ubuntu, SUSE, Unix, Solaris, AIX, FreeBSD
- `iOS` = 'iOS',
- `Android` = 'Android',
- `Unknown` = 'Unknown',

`Browser`:
- `Chrome` = 'Chrome',
- `Yandex` = 'YaBrowser',
- `Opera` = 'Opera',
- `Firefox` = 'Firefox',
- `Safari` = 'Safari',
- `Edge` = 'Edge',
- `IE` = 'IE',
- `Unknown` = 'Unknown',

----

## FeatureFlags

FeatureFlags — сервис, позволяет включать или выключать определенные части функциональности приложения

Может применяться в 2-х случаях:
- для сокрытия функциональности, находящейся на ранних стадиях разработки (Boolean)
- для A/B/n тестирования (String)

### Использование

1. Создать модуль featureFlags
├── index.ts             
└── domain/                   
    ├── constants.ts             # Конфиги флагов
    └── stores/           
        ├── FeatureFlagsStore.ts # Фасад для взаимодействия с сервисом
        └── index.ts

2. Зарегистрировать флаги
Для A/B/n тестирования (StringFeatureFlags) обязательно наличие целевого события для вычисления конверсии
Записываем дефолтные значения для флагов In-memory на случай, если источник флагов не отвечает

```typescript
export const DEFAULT_STRING_VALUE = 'NA' as const;

export const BooleanFeatureFlags: BooleanFeatureFlagsMap<FeatureFlagsRepositoryDTO.KeyProductionReady> =
  {
    NewFeature: {
      flagKey: 'NewFeature',
      defaultValue: false,
    },
  };

export const StringFeatureFlags: StringFeatureFlagsMap<
  FeatureFlagsRepositoryDTO.KeyForExperiment,
  FeatureFlagsRepositoryDTO.EventType
> = {
  FeatureExperiment: {
    flagKey: 'FeatureExperiment',
    defaultValue: 'one',
    variants: {
      one: 'one',
      two: 'two',
    },
    eventType: 'FeatureExperimentEvent',
  },
};
```

3. Создать репозитрий с методами getBooleanFlagList и getStringFlagList, которые получают из remote источника состояния флагов

4. Создать фасад для взаимодействия с сервисом, где при инициализации передать коллбэк для обновления данных о состоянии флагов

```typescript
export class FeatureFlagsStore {
  constructor(
    private readonly flagsService: FeatureFlagsService<
      FeatureFlagsRepositoryDTO.KeyProductionReady,
      FeatureFlagsRepositoryDTO.KeyForExperiment,
      FeatureFlagsRepositoryDTO.EventType
    >,
  ) {
    makeAutoObservable(this);
  }

  public init = () => {
    this.flagsService.init(navigationRouter.onNavigate);
  };

  public get productionReady() {
    return this.flagsService.productionReady;
  }

  public get experiments() {
    return this.flagsService.experiments;
  }
}

export const featureFlagsStore = new FeatureFlagsStore(
  createFeatureFlagsService(
    {
      booleanFeatureFlags: BooleanFeatureFlags,
      stringFeatureFlags: StringFeatureFlags,
      defaultStringValue: DEFAULT_STRING_VALUE,
    },
    featureFlagsRepository,
  ),
);
```

5. Инициализировать featureFlagsStore

```typescript
featureFlagsStore.init();
```

6. Применить во View-компоненте

```tsx
export const Main = () => {
  const featureProductionReady = featureFlagsStore.productionReady;

  return (
    <Main>
        {featureProductionReady.NewFeature && (
          <FeatureInDevelop />
        )}
    </Main>
  );
};
```

```tsx
export const Main = () => {
  const { flags, track } = featureFlagsStore.experiments;
  const handleClick = () => {
    track('FeatureExperimentEvent');
  };

  return (
    {flags?.FeatureExperiment === 'two' ? (
      <VariantTwo onClick={handleClick} />
    ) : (
      <VariantOne onClick={handleClick} />
    )}
  );
};
```

