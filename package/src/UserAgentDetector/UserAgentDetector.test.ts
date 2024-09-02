import { describe, expect, it } from 'vitest';

import { Browser, OperatingSystem } from './enums';
import { UserAgentDetector } from './UserAgentDetector';

describe('UserAgentDetector', () => {
  describe('Определение ОС', () => {
    it.each<string>([
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_0) AppleWebKit/600.7.26 (KHTML, like Gecko) Version/13.4.53 Safari/626.22',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:65.0) Gecko/20100101 Firefox/65.0',
      'Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC) Opera 7.54 [en]',
    ])('Срабатывает верно для MacOS, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.os).toEqual(OperatingSystem.MacOS);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.2949.117 Safari/537.36 OPR/63.0.3368.43',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0 IQIYI/10.9.1.0 (UWP; WebView) IQIYI/10.9.1.0 (UWP; WebView)',
      'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E; Tablet PC 2.0; GWX:RESERVED; MSOffice 12)',
      'Mozilla/5.0 (Windows NT 6.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3772.100 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; tb-gmx/2.6.9; rv:11.0) like Gecko',
    ])('Срабатывает верно для Windows, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.os).toEqual(OperatingSystem.Windows);
    });

    it.each<string>([
      'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B141',
      'Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/170.0.367390950 Mobile/15E148 Safari/604.1',
    ])('Срабатывает верно для iOS, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.os).toEqual(OperatingSystem.iOS);
    });

    it.each<string>([
      // Linux general user agents
      'Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/105.0',
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
      // CentOS
      'Mozilla/5.0 (X11; CentOS Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      // Debian
      'Mozilla/5.0 (X11; Debian; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
      // Mint
      'Mozilla/5.0 (X11; Linux Mint; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0',
      // RedHat
      'Mozilla/5.0 (X11; RedHat; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
      // Ubuntu
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
      // SUSE
      'Mozilla/5.0 (X11; SUSE; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0',
      // Unix (general case)
      'Mozilla/5.0 (X11; U; Unix; en-US; rv:1.9.1.16) Gecko/20100101 Firefox/11.0',
      // Solaris
      'Mozilla/5.0 (X11; SunOS sun4u; en-US; rv:1.9.0.1) Gecko/2008071615 Firefox/3.0.1',
      // AIX
      'Mozilla/5.0 (X11; U; AIX 7.1; en-US; rv:1.8.1.12) Gecko/20080219 Firefox/2.0.0.12',
      // FreeBSD
      'Mozilla/5.0 (X11; FreeBSD amd64; rv:95.0) Gecko/20100101 Firefox/95.0',
    ])('Срабатывает верно для Linux и Unix, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.os).toEqual(OperatingSystem.Unix);
    });

    it.each<string>([
      'Mozilla/5.0 (Linux; Android 11; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.28 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 11; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.28 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 10; SM-N960F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.0 Chrome/90.0.4430.210 Mobile Safari/537.36',
    ])('Срабатывает верно для Android, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.os).toEqual(OperatingSystem.Android);
    });

    it('Возвращает Unknown при пустой строке userAgent', () => {
      const sut = new UserAgentDetector('');

      expect(sut.os).toEqual(OperatingSystem.Unknown);
    });
  });

  describe('Определение браузера', () => {
    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
    ])('Срабатывает верно для Chrome, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Chrome);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:85.0) Gecko/20100101 Firefox/85.0',
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0',
    ])('Срабатывает верно для Firefox, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Firefox);
    });

    it.each<string>([
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
      'Mozilla/5.0 (Windows; U; Windows NT 6.1; ko-KR) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27',
      'Mozilla/5.0 (X11; U; Linux x86_64; en-ca) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/531.2+',
    ])('Срабатывает верно для Safari, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Safari);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.818.62 Safari/537.36 Edg/90.0.818.62',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.63',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36 Edg/88.0.705.81',
    ])('Срабатывает верно для Edge, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Edge);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.254',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 OPR/76.0.4017.177',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 OPR/75.0.3969.218',
    ])('Срабатывает верно для Opera, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Opera);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 YaBrowser/21.6.2.536 Yowser/2.5 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 YaBrowser/21.5.1.274 Yowser/2.5 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 YaBrowser/21.3.3.274 Yowser/2.5 Safari/537.36',
    ])('Срабатывает верно для Yandex Browser, userAgent="%s"', (userAgent) => {
      const sut = new UserAgentDetector(userAgent);

      expect(sut.browser).toEqual(Browser.Yandex);
    });

    it.each<string>([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:11.0) like Gecko',
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)',
      'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
    ])(
      'Срабатывает верно для Internet Explorer, userAgent="%s"',
      (userAgent) => {
        const sut = new UserAgentDetector(userAgent);

        expect(sut.browser).toEqual(Browser.IE);
      },
    );

    it('Возвращает Unknown при пустой строке userAgent', () => {
      const sut = new UserAgentDetector('');

      expect(sut.browser).toEqual(Browser.Unknown);
    });
  });

  describe('Определение версии браузера', () => {
    it.each([
      [
        Browser.Chrome,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        '91.0.4472.124',
      ],
      [
        Browser.Firefox,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        '89.0',
      ],
      [
        Browser.Safari,
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
        '14.0.3',
      ],
      [
        Browser.Edge,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.818.62 Safari/537.36 Edg/90.0.818.62',
        '90.0.818.62',
      ],
      [
        Browser.Opera,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.254',
        '77.0.4054.254',
      ],
      [
        Browser.Yandex,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 YaBrowser/21.6.2.536 Yowser/2.5 Safari/537.36',
        '21.6.2.536',
      ],
      [
        Browser.IE,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; rv:11.0) like Gecko',
        '11.0',
      ],
    ])(
      'Срабатывает верно для браузера %s, userAgent="%s"',
      (expectedBrowser, userAgent, expectedVersion) => {
        const sut = new UserAgentDetector(userAgent);

        expect(sut.browser).toEqual(expectedBrowser);
        expect(sut.browserVersion).toEqual(expectedVersion);
      },
    );

    it('Возвращает undefined при пустой строке userAgent', () => {
      const sut = new UserAgentDetector('');

      expect(sut.browserVersion).toBeUndefined();
    });
  });
});
