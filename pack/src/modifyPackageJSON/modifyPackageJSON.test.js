import fs from 'fs';

import { vi } from 'vitest';

import { modifyPackageJSON } from './modifyPackageJSON';

const DEFAULT_PACKAGE_JSON = {
  name: '@astral/services',
  version: '1.0.0',
  browser: './src/index.ts',
  main: './src/index.ts',
  scripts: {
    dev: 'tsc --watch',
  },
  dependencies: {
    '@astral/icons': '^0.31.0',
    '@emotion/cache': '11.7.1',
  },
  peerDependencies: {
    react: '>=17.0.0',
  },
  devDependencies: {
    '@types/lodash-es': '^4.17.5',
    '@types/react-datepicker': '4.4.0',
  },
};

describe('modifyPackageJSON', () => {
  let packageFileData = DEFAULT_PACKAGE_JSON;

  beforeEach(() => {
    vi.spyOn(fs, 'writeFileSync').mockImplementation((path, data) => {
      packageFileData = JSON.parse(data);
    });

    vi.spyOn(fs, 'readFileSync').mockImplementation(() =>
      JSON.stringify(packageFileData),
    );
  });

  it('Exports содержит дефолтные значения для входной точки', () => {
    modifyPackageJSON({
      releaseTag: '1.0.0',
      packageExports: { './fonts': { import: './fonts/*' } },
    });

    expect(packageFileData.exports['.']).toEqual({
      vitest: './node/index.js',
      module: './index.js',
      require: './node/index.js',
    });
  });

  it('PackageExports добавляет в exports значения', () => {
    modifyPackageJSON({
      releaseTag: '1.0.0',
      packageExports: { './fonts': { import: './fonts/*' } },
    });

    expect(packageFileData.exports['./fonts']).toEqual({ import: './fonts/*' });
  });

  it('Main поле содержит ссылку на файлы из директории node', () => {
    modifyPackageJSON({ releaseTag: '1.0.0', main: './src/index.ts' });
    expect(packageFileData.main).toBe('./node/index.js');
  });
});
