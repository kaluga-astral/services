import UAParser, { type UAParserInstance } from 'ua-parser-js';

import { Browser, OperatingSystem } from './enums';

/**
 * Сервис для парсинга UserAgent пользователя
 * @property {OperatingSystem} os операционная система.
 * @property {Browser} browser браузер.
 * @property {string | undefined} browserVersion версия браузера.
 */
export class UserAgentDetector {
  /**
   * Операционная система пользователя.
   * OperatingSystem.Unix включает в себя Linux, CentOS, Debian, Mint, RedHat, Ubuntu, SUSE, Unix, Solaris, AIX, FreeBSD
   * */
  public os: OperatingSystem;

  /** Браузер пользователя. */
  public browser: Browser;

  /**
   * Версия браузера пользователя cтрокой.
   * Если браузер неизвестный (Browser.Unknown), то версия равна undefined.
   * */
  public browserVersion: string | undefined;

  private parser: UAParserInstance;

  constructor(userAgent: string) {
    this.parser = new UAParser(userAgent);
    this.os = this.detectOperatingSystem();

    const { browser, version } = this.detectBrowser();

    this.browser = browser;
    this.browserVersion = version;
  }

  private detectOperatingSystem(): OperatingSystem {
    const { name } = this.parser.getOS();

    //  @see https://www.npmjs.com/package/ua-parser-js?activeTab=readme#Methods
    //  AIX, Amiga OS, Android[-x86], Arch, Bada, BeOS, BlackBerry, CentOS, Chromium OS,
    //  Contiki, Fedora, Firefox OS, FreeBSD, Debian, Deepin, DragonFly, elementary OS,
    //  Fuchsia, Gentoo, GhostBSD, GNU, Haiku, HarmonyOS, HP-UX, Hurd, iOS, Joli, KaiOS,
    //  Linpus, Linspire,Linux, Mac OS, Maemo, Mageia, Mandriva, Manjaro, MeeGo, Minix,
    //  Mint, Morph OS, NetBSD, NetRange, NetTV, Nintendo, OpenBSD, OpenVMS, OS/2, Palm,
    //  PC-BSD, PCLinuxOS, Plan9, PlayStation, QNX, Raspbian, RedHat, RIM Tablet OS,
    //  RISC OS, Sabayon, Sailfish, SerenityOS, Series40, Slackware, Solaris, SUSE,
    //  Symbian, Tizen, Ubuntu, Unix, VectorLinux, Viera, watchOS, WebOS,
    //  Windows [Phone/Mobile], Zenwalk, ...

    if (!name) {
      return OperatingSystem.Unknown;
    }

    if (name.includes('Windows')) {
      return OperatingSystem.Windows;
    }

    if (name === 'Mac OS') {
      return OperatingSystem.MacOS;
    }

    // Дистрибутивы Linux и Unix-подобные ОС, которые поддерживает КриптоПро,
    // и которые может определить 'ua-parser-js'
    // @see https://www.cryptopro.ru/products/csp/compare
    const unixLikeOsList = [
      // Дистрибутивы Linux
      'Linux',
      'CentOS',
      'Debian',
      'Mint',
      'RedHat',
      'Ubuntu',
      'SUSE',
      // Unix подобные ОС
      'Unix',
      'Solaris',
      'AIX',
      'FreeBSD',
    ];

    // Обозначаем все как Unix (для упрощения)
    if (unixLikeOsList.includes(name)) {
      return OperatingSystem.Unix;
    }

    if (name === 'iOS') {
      return OperatingSystem.iOS;
    }

    if (name.includes('Android')) {
      return OperatingSystem.Android;
    }

    return OperatingSystem.Unknown;
  }

  /**
   * Функция определения браузера
   * За основу взят код с тестовой страницы КриптоПро
   * @see https://cryptopro.ru/sites/default/files/products/cades/demopage/cades_bes_sample.html
   * */
  private detectBrowser(): {
    browser: Browser;
    version: string | undefined;
  } {
    const { name, version } = this.parser.getBrowser();

    //  @see https://www.npmjs.com/package/ua-parser-js?activeTab=readme#Methods
    //  2345Explorer, 360 Browser, Alipay, Amaya, Android Browser, Arora, Avant, Avast,
    //  AVG, Baidu, Basilisk, Blazer, Bolt, Brave, Bowser, Camino, Chimera,
    //  Chrome Headless, Chrome WebView, Chrome, Chromium, Cobalt, Comodo Dragon, Dillo,
    //  Dolphin, Doris, DuckDuckGo, Edge, Electron, Epiphany, Facebook, Falkon, Fennec,
    //  Firebird, Firefox [Focus/Reality], Flock, Flow, GSA, GoBrowser, Heytap,
    //  Huawei Browser, iCab, ICE Browser, IE, IEMobile, IceApe, IceCat, IceDragon,
    //  Iceweasel, Instagram, Iridium, Iron, Jasmine, Kakao[Story/Talk], K-Meleon,
    //  Kindle, Klar, Klarna, Konqueror, LBBROWSER, Line, LinkedIn, Links, Lunascape,
    //  Lynx, MIUI Browser, Maemo, Maxthon, Midori, Minimo, Mobile Safari, Mosaic,
    //  Mozilla, NetFront, NetSurf, Netfront, Netscape, NokiaBrowser, Obigo,
    //  Oculus Browser, OmniWeb, Opera Coast, Opera [GX/Mini/Mobi/Tablet], PaleMoon,
    //  PhantomJS, Phoenix, Polaris, Puffin, QQ, QQBrowser, QQBrowserLite, Quark,
    //  QupZilla, RockMelt, Safari, Sailfish Browser, Samsung Internet, SeaMonkey, Silk,
    //  Skyfire, Sleipnir, Slim, SlimBrowser, Smart Lenovo Browser, Snapchat,
    //  Sogou [Explorer/Mobile], Swiftfox, Tesla, TikTok, Tizen Browser, Twitter,
    //  UCBrowser, UP.Browser, Viera, Vivaldi, Vivo Browser, Waterfox, WeChat, Weibo,
    //  Yandex, w3m, Whale Browser, ...

    if (!name) {
      return {
        browser: Browser.Unknown,
        version,
      };
    }

    if (name === 'Chrome') {
      return {
        browser: Browser.Chrome,
        version,
      };
    }

    if (name.includes('Firefox')) {
      return {
        browser: Browser.Firefox,
        version,
      };
    }

    if (name === 'Yandex') {
      return {
        browser: Browser.Yandex,
        version,
      };
    }

    if (name.includes('Opera')) {
      return {
        browser: Browser.Opera,
        version,
      };
    }

    if (name === 'Edge') {
      return {
        browser: Browser.Edge,
        version,
      };
    }

    if (name === 'Safari') {
      return {
        browser: Browser.Safari,
        version,
      };
    }

    if (name === 'IE') {
      return {
        browser: Browser.IE,
        version,
      };
    }

    return {
      browser: Browser.Unknown,
      version,
    };
  }

  /**
   * Функция переопределения ОС.
   * Позволяет подменить ОС для ручного тестирования.
   * */
  public _setOs(newOS: OperatingSystem) {
    this.os = newOS;
  }

  /**
   * Функция переопределения Браузера.
   * Позволяет подменить Браузер для ручного тестирования.
   */
  public _setBrowser(newBrowser: Browser) {
    this.browser = newBrowser;
  }
}

/**
 * Инстанс сервиса для парсинга UserAgent пользователя
 * @property {OperatingSystem} os операционная система.
 * @property {Browser} browser браузер.
 * @property {string | undefined} browserVersion версия браузера.
 */
export const userAgentDetector = new UserAgentDetector(
  typeof window !== 'undefined' ? window?.navigator.userAgent : '',
);
