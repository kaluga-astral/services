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

FeatureFlagsStore — позволяет включать или выключать определенные части функциональности приложения

Может применяться в 2-х случаях:
- для сокрытия функциональности, находящейся на ранних стадиях разработки (Boolean)
- для A/B/n тестирования (String)

### Использование

1. Создать модуль featureToggle
```
├── index.ts             
└── domain/                   
    ├── constants.ts              # Конфиги флагов
    └── stores/           
        ├── FeatureToggleStore.ts # Фасад для взаимодействия со стором
        └── index.ts
```

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

3. Создать репозиторий с методами getBooleanFlagList и getStringFlagList, которые получают из remote источника состояния флагов

4. Создать фасад для взаимодействия с сервисом, где при инициализации передать коллбэк для обновления данных о состоянии флагов

```typescript
export class FeatureToggleStore {
  constructor(
    private readonly flagsStore: FeatureFlagsStore<
      FeatureFlagsRepositoryDTO.KeyProductionReady,
      FeatureFlagsRepositoryDTO.KeyForExperiment,
      FeatureFlagsRepositoryDTO.EventType
    >,
    private readonly router: Router
  ) {
    makeAutoObservable(this);
  }

  public init = () => {
    this.flagsStore.init(this.router.onNavigate);
  };

  public get productionReady() {
    return this.flagsStore.productionReady;
  }

  public get experiments() {
    return this.flagsStore.experiments;
  }
}

const featureFlagsStore = createFeatureFlagsStore(
  {
    booleanFeatureFlags: BooleanFeatureFlags,
    stringFeatureFlags: StringFeatureFlags,
    defaultStringValue: DEFAULT_STRING_VALUE,
  },
  featureFlagsRepository,
);

export const featureToggleStore = new FeatureToggleStore(
  featureFlagsStore,
  routerService
);
```

5. Инициализировать featureToggleStore

```typescript
featureToggleStore.init();
```

6. Применить во View-компоненте

```tsx
export const Main = observer(() => {
  const featureProductionReady = featureToggleStore.productionReady;

  return (
    <Main>
        {featureProductionReady.NewFeature && (
          <FeatureInDevelop />
        )}
    </Main>
  );
});
```

```tsx
export const Main = observer(() => {
  const { flags, track } = featureToggleStore.experiments;
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
});
```

### Как работает

При первой загрузке приложения сразу происходит получение данных о состоянии флагов из двух запросов.

При каждом переходе на новую страницу происходит перезапрос и данные о состоянии флагов обновляются сразу, не дожидаясь монтирования компонента, в котором требуется флаг. Поэтому при инициализации необходимо передать коллбэк, который срабатывает при смене URL.

При медленной сети запрос может длиться долго, и данные могут прийти после того, как смонтировался компонент. Поэтому флаги обладают реактивным свойством и могут обновить состояние компонента после монтирования.

