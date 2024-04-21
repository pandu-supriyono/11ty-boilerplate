const sass = require('sass');
const path = require('path');
const { createHash } = require('crypto');
const UserConfig = require('@11ty/eleventy/src/UserConfig');

const isProduction = process.env.NODE_ENV === 'production';

/** @param {UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('scss');

  eleventyConfig.addExtension('scss', {
    read: false,
    getData: (inputPath) => {
      const data = {
        eleventyExcludeFromCollections: true,
      };

      if (path.basename(inputPath).startsWith('_')) {
        return data;
      }

      const { css, sourceMap } = sass.compile(inputPath, {
        sourceMap: !isProduction,
        sourceMapIncludeSources: true,
        style: isProduction ? 'compressed' : 'expanded',
        loadPaths: [path.join(process.cwd(), 'node_modules')],
      });

      data._content = css;

      if (sourceMap) {
        const base64SourceMap = (
          Buffer.from(JSON.stringify(sourceMap), 'utf8') || ''
        ).toString('base64');

        const sourceMapComment =
          '/*# sourceMappingURL=data:application/json;charset=utf-8;base64,' +
          base64SourceMap +
          ' */';

        data._content += '\n'.repeat(2) + sourceMapComment;
      }

      data._hash = getHash(data._content);

      return data;
    },
    compileOptions: {
      cache: false,
      permalink: function (_, inputPath) {
        if (path.basename(inputPath).startsWith('_')) {
          return false;
        }

        if (isProduction) {
          return (data) => `/assets/main.${data._hash}.css`;
        }

        return '/assets/main.css';
      },
    },
    compile: () => (data) => data._content,
  });
};

function getHash(content, length = 8) {
  return createHash('md5').update(content).digest('hex').substr(0, length);
}
