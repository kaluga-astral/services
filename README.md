# @astral/services

Shared js-сервисы.

----

## UserAgentService

UserAgentService — сервис парсинга строки User-Agent браузера для получения информацию о
текущей ОС, браузере и версии браузера пользователя.

#### Использование

```typescript
import { 
  Browser, 
  OperatingSystem, 
  type UserAgentService,
  userAgentService as userAgentServiceInstance, 
} from '@astral/services';

export class UIStore {
  constructor(private readonly userAgentService: UserAgentService) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public get isOsSupported() {
    return this.userAgentService.os === OperatingSystem.Windows;
  }

  public get browserName() {
    return this.userAgentService.browser; // Browser.Chrome === 'Chrome'
  }

  public get browserVersion() {
    return this.userAgentService.browserVersion; // 91.0.4472.124
  }
}

export const createUIStore = () => new UIStore(userAgentServiceInstance);
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
