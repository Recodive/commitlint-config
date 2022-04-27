const lint = require("@commitlint/lint");
const functionRules = require("commitlint-plugin-function-rules");
const { rules, parserOpts } = require(".");

const lintMessage = async message => {
	const m = message.replace(/^\s+/, "").trim();
	const result = await lint.default(m, rules, {
		parserOpts,
		plugins: {
			"commitlint-plugin-function-rules": functionRules
		}
	});

	return result;
};

test("a valid commit message", async () => {
	const result = await lintMessage("feat(RCD-1): a valid commit message");

	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});

test("a valid multi line commit", async () => {
	const result = await lintMessage(
		`test(RCD-1): a valid angular commit with a scope

     Some content in the body`
	);

	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});

test("a leading blank line after header", async () => {
	const result = await lintMessage(
		`test(RCD-1): a valid angular commit with a scope
     Some content in the body`
	);

	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings[0].message).toBe("body must have leading blank line");
});

test("an invalid scope", async () => {
	const result = await lintMessage(`no: no is not not an invalid commit type`);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"type must be one of [build, ci, docs, feat, fix, perf, refactor, revert, style, test]"
	);
	expect(result.warnings).toStrictEqual([]);
});

test("no type", async () => {
	const result = await lintMessage(
		`feat: no is not not an invalid commit type`
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe("a scope must be set");
	expect(result.warnings).toStrictEqual([]);
});

test("an invalid type", async () => {
	const result = await lintMessage(
		`feat(heya): no is not not an invalid commit type`
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe("scope must be upper-case");
	expect(result.warnings).toStrictEqual([]);
});

test("an invalid jira id", async () => {
	const result = await lintMessage(
		`feat(HEYA): no is not not an invalid commit type`
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe("scope must be a JIRA issue ID");
	expect(result.warnings).toStrictEqual([]);
});

test("a long header", async () => {
	const result = await lintMessage(
		`test(RCD-1): that its an error when there is ia realllllllllllllllllllllly long header`
	);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe(
		"header must not be longer than 72 characters, current length is 86"
	);
	expect(result.warnings).toStrictEqual([]);
});

test("message header with ! in it", async () => {
	const result = await lintMessage(`test!: with a breaking change in the type`);

	expect(result.valid).toBe(false);
	expect(result.errors[0].message).toBe("a scope must be set");
	expect(result.warnings).toStrictEqual([]);
});

test("message header with ! in it and a scope", async () => {
	const result = await lintMessage(
		`test(RCD-1)!: with a breaking change in the type`
	);

	expect(result.valid).toBe(true);
	expect(result.errors).toStrictEqual([]);
	expect(result.warnings).toStrictEqual([]);
});
