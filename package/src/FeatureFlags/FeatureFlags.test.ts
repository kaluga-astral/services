import { describe, expect, it, vi } from 'vitest';

import { FeatureFlags } from './FeatureFlags';

describe('FeatureFlags', () => {
  const config = {
    booleanFeatureFlags: {
      featureA: { flagKey: 'featureA', defaultValue: false },
    },
    stringFeatureFlags: {
      experimentA: {
        flagKey: 'experimentA',
        defaultValue: 'variantA',
        variants: {
          variantA: 'variantA',
          variantB: 'variantB',
        },
        eventType: 'conversionEventA',
      },
      experimentB: {
        flagKey: 'experimentB',
        defaultValue: 'variantA',
        variants: {
          variantA: 'variantA',
          variantB: 'variantB',
        },
        eventType: 'conversionEventB',
      },
    },
    defaultStringValue: 'NA',
  };
  const createConfigMock = () => {
    return config;
  };

  const createSourcesMock = () => {
    return {
      getBooleanFlagList: vi.fn().mockResolvedValue({
        data: { value: { featureA: true } },
      }),
      getStringFlagList: vi.fn().mockResolvedValue({
        data: {
          value: {
            experimentA: 'variantA',
            experimentB: config.defaultStringValue,
          },
        },
      }),
      track: vi.fn(),
    };
  };

  describe('Сокрытие функциональности', () => {
    it('Значение флага соответствует значению из источника данных', () => {
      const configMock = createConfigMock();
      const sourcesMock = createSourcesMock();
      const sut = new FeatureFlags(configMock, sourcesMock);

      expect(sut.productionReady.featureA).toBeFalsy();
    });

    it('Пустой объект возвращается, если флаги не зарегистрированы и в коде происходит чтение флагов', () => {
      const configMock = {
        ...createConfigMock(),
        booleanFeatureFlags: undefined,
      };
      const sourcesMock = createSourcesMock();

      const sut = new FeatureFlags(configMock, sourcesMock);

      const flags = sut.productionReady;

      expect(flags).toMatchObject({});
    });
  });

  describe('A/B/n тестирование', () => {
    it('Значение флага соответствует значению из источника данных', () => {
      const configMock = createConfigMock();
      const sourcesMock = createSourcesMock();
      const sut = new FeatureFlags(configMock, sourcesMock);

      expect(sut.experiments.flags?.experimentA).toBe('variantA');
    });

    it('Целевое событие отправляется', () => {
      const configMock = createConfigMock();
      const sourcesMock = createSourcesMock();
      const service = new FeatureFlags(configMock, sourcesMock);

      service.experiments.track('conversionEventA');
      expect(sourcesMock.track).toHaveBeenCalledWith('conversionEventA');
    });

    it('Предупреждение в консоли браузера выводится, если флаги не зарегистрированы и в коде происходит чтение флагов', () => {
      const configMock = {
        ...createConfigMock(),
        stringFeatureFlags: undefined,
      };
      const sourcesMock = createSourcesMock();
      const consoleWarnSpy = vi.spyOn(console, 'warn');

      const sut = new FeatureFlags(configMock, sourcesMock);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const flags = sut.experiments;

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'FeatureFlags: флаги для проведения A/B/n тестирования не зарегистрированы',
      );
    });

    it('Значение флага заменяется на дефолтное, если из источника данных пришло неизвестное значение', () => {
      const configMock = createConfigMock();
      const sourcesMock = createSourcesMock();
      const sut = new FeatureFlags(configMock, sourcesMock);

      expect(sut.experiments.flags?.experimentB).toBe(
        config.stringFeatureFlags.experimentB.defaultValue,
      );
    });
  });
});
