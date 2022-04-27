module.exports = {
	plugins: ["commitlint-plugin-function-rules"],
	parserPreset: {
		parserOpts: { headerPattern: /^(\w*)(?:\(([A-Z]+-[0-9]+)\))?!?: (.*)$/ }
	},
	rules: {
		"scope-case": [2, "always", "upper-case"],
		"body-leading-blank": [1, "always"],
		"footer-leading-blank": [1, "always"],
		"header-max-length": [2, "always", 72],
		"subject-case": [
			2,
			"never",
			["sentence-case", "start-case", "pascal-case", "upper-case"]
		],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lower-case"],
		"type-enum": [
			2,
			"always",
			[
				"build",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"style",
				"test"
			]
		],
		"function-rules/scope-enum": [
			2,
			"always",
			parsed => {
				if (parsed.scope?.match(/([A-Z]+-[0-9]+)/)) {
					return [true];
				}
				if (parsed.raw?.match(/^(\w*)(?:\(([A-Z]+-[0-9]+)\))!?: (.*)$/)) {
					return [true];
				}
				if (parsed.raw?.match(/^(\w*)(?:\(([A-Z]+-[0-9]+)\))?!?: (.*)$/)) {
					return [false, `a scope must be set`];
				}
				return [false, `scope must be a JIRA issue ID`];
			}
		]
	}
};
