/*
	File: test/expected.ts
	cpuabuse.com
*/

/**
 * Contains constants for comparing against in testing.
 */

export const flowerShopInit = `events:
data:
  file: flowers
  path: relative
  folder: data
  extend: false
behaviors:
errors:
branch:
  extend: true
subsystems:
  extend: true`;
export const flowerShopYamlInit = {
	behaviors: null,
	branch: {
		extend: true
	},
	data: {
		extend: false,
		file: "flowers",
		folder: "data",
		path: "relative"
	},
	errors: null,
	events: null,
	subsystems: {
		extend: true
	}
};
export const exampleInit = `behaviors:
errors:
events:`;
export const exampleYamlInit = {
	behaviors: null,
	errors: null,
	events: null
};
