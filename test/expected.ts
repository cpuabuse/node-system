/*
	File: test/expected.ts
	cpuabuse.com
*/

/**
 * Contains constants for comparing against in testing.
 */

export const flowerShopInit: string = `data:
  file: flowers
  path: relative
  folder: data
  extend: false
errors:
branch:
  extend: true
subsystems:
  extend: true
`;
export const flowerShopYamlInit: any = {
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
	subsystems: {
		extend: true
	}
};
export const exampleInit: string = `errors:
subsystems:
  extend: true
`;
export const exampleYamlInit: any = {
	errors: null,
	subsystems: {
		extend: true
	}
};
