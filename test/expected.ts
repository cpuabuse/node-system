// test/expected.ts
/*
	Contains constants for comparing against in testing.
*/
"use strict";

const flowerShopInit = `events:
data:
  file: flowers
  path: relative
  folder: data
  extend: false
behaviors:
errors:
branch:
  extend: true`;
const exampleInit = `behaviors:
errors:
events:`;

module.exports = {
	flowerShopInit,
	exampleInit
}