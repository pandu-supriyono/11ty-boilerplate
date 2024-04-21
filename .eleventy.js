const UserConfig = require('@11ty/eleventy/src/UserConfig');

/** @param {UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addGlobalData('pkg', require('./package.json'));

  eleventyConfig.addPassthroughCopy({
    './src/fonts': 'assets/fonts',
  });

  return {
    dir: {
      input: 'src',
      layouts: 'layouts',
      includes: 'includes',
      data: 'data',
      output: 'dist',
    },
  };
};
