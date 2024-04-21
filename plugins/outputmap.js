const UserConfig = require('@11ty/eleventy/src/UserConfig');
const path = require('path');

/** @param {UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  const outputMap = {};

  eleventyConfig.addTransform('outputMap', function (content) {
    const filepath = path.relative('src', this.page.inputPath);
    outputMap[filepath] = this.page.url;
    return content;
  });

  eleventyConfig.addFilter('hashed', function (filepath) {
    if (!outputMap[filepath]) {
      throw new Error(`hashed: ${filepath} not found in map.`);
    }

    return outputMap[filepath];
  });
};
