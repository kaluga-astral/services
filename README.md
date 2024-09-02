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
