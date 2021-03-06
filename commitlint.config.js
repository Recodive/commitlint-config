module.exports = {
	plugins: ["commitlint-plugin-function-rules"],
	parserPreset: {
		parserOpts: { headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/ }
	},
	rules: {
		"body-leading-blank": [2, "always"],
		"footer-leading-blank": [2, "always"],
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
				"chore",
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
				if (parsed.scope && parsed.scope.toUpperCase() !== parsed.scope) {
					if (!parsed.raw?.startsWith("revert")) {
						return [false, "scope must be upper-case"];
					} else {
						if (
							parsed.raw?.match(
								/^(?:revert\(([A-Z]+-[0-9]+)\)!?: )(\w*)(?:\(([A-Z]+-[0-9]+)\))!?: (.*)$/
							)
						) {
							return [true];
						} else {
							return [false, "scope must be upper-case"];
						}
					}
				}
				if (parsed.scope?.match(/[A-Z]+-[0-9]+/)) {
					if (parsed.type === "revert") {
						return [
							false,
							"revert commits should have the full commit name that is being reverted"
						];
					} else {
						return [true];
					}
				}
				if (parsed.raw?.match(/^(\w*)(?:\(([A-Z]+-[0-9]+)\))!?: (.*)$/)) {
					return [true];
				}
				if (parsed.raw?.match(/^(\w*)(?:\(([A-Z]+-[0-9]+)\))?!?: (.*)$/)) {
					if (parsed.type === "revert") {
						return [
							false,
							"revert commits should have the associated JIRA ID includes in the revert scope"
						];
					} else {
						return [false, `a scope must be set`];
					}
				}
				if (!parsed.subject) {
					return [false, `a subject must be set`];
				}
				return [false, `scope must be a JIRA issue ID`];
			}
		]
	}
};
