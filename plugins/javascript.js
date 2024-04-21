const UserConfig = require('@11ty/eleventy/src/UserConfig');
const esbuild = require('esbuild');

const isProduction = process.env.NODE_ENV === 'production';

const mainJsPath = './src/javascripts/main.js';

/** @param {UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('js');

  eleventyConfig.addExtension('js', {
    read: false,
    getData: (inputPath) => {
      const data = {
        eleventyExcludeFromCollections: true,
      };

      if (inputPath != mainJsPath) {
        return data;
      }

      const { outputFiles } = esbuild.buildSync({
        entryPoints: [inputPath],
        bundle: true,
        sourcemap: isProduction ? false : 'inline',
        minify: isProduction,
        write: false,
        outdir: 'out',
      });

      const { hash, text: js } = outputFiles[0];

      data._content = js;
      data._hash = hash;

      return data;
    },
    compileOptions: {
      cache: false,
      permalink: function (_, inputPath) {
        if (inputPath != mainJsPath) {
          return false;
        }

        if (isProduction) {
          return (data) => `/assets/main.${data._hash}.js`;
        }

        return '/assets/main.js';
      },
    },
    compile: () => (data) => data._content,
  });

  eleventyConfig.addWatchTarget('./src/javascripts');
};
