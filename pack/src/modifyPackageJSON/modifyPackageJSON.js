const fs = require('fs');

const { PACKAGES_NAMES } = require('../constants');

const readPackageJSON = (packageJSONPath) =>
  JSON.parse(fs.readFileSync(packageJSONPath));

const updatePackagesVersions = (packageJSONPath, rootPackageVersion) => {
  const packageData = readPackageJSON(packageJSONPath);

  return {
    ...packageData,
    version: rootPackageVersion,
  };
};

const modifyPackageJSON = ({
  /**
   * @description Новая версия пакета
   * @example modifyPackageJSON({ releaseTag: '1.1.0' })
   * */
  releaseTag,
  /**
   * @description Какие exports в package.json присутсвуют для данного пакета
   * @example modifyPackageJSON({ packageExports: { fonts: { import: './fonts/*' }  } })
   * */
  packageExports,
}) => {
  if (!releaseTag) {
    throw Error('modifyPackageJSON: releaseTag is not defined');
  }

  console.log('Starting modifyPackageJSON...');
  console.log('Update packages versions and deps');

  const packageData = updatePackagesVersions('./package.json', releaseTag);

  const {
    scripts,
    devDependencies,
    typesVersions,
    keywords = [],
    ...restPackageData
  } = packageData;

  console.log('Write data to lib package.json');

  const modifiedPackageData = {
    ...restPackageData,
    version: releaseTag,
    author: 'Astral.Soft',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'git+https://github.com/kaluga-astral/services',
    },
    bugs: {
      url: 'https://github.com/kaluga-astral/services/issues',
    },
    keywords,
    sideEffects: false,
    types: './index.d.ts',
    main: './node/index.js',
    module: './index.js',
    browser: './index.js',
    exports: {
      '.': {
        // Специально для vitest добавляется отдельный exports потому, что он быстро работает только с cjs, когда есть barrel files
        // Порядок имеет значение
        vitest: './node/index.js',
        module: './index.js',
        require: './node/index.js',
      },
      ...packageExports,
    },
  };

  fs.writeFileSync(
    './lib/package.json',
    JSON.stringify(modifiedPackageData, null, 2),
  );

  console.log('Finish modifyPackageJSON');
};

module.exports = { modifyPackageJSON };
