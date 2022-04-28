const lint = require("@commitlint/lint");
const functionRules = require("commitlint-plugin-function-rules");
const { rules, parserOpts } = require(".");

const lintMessage = async message =>
	lint.default(message.replace(/^\s+/, "").trim(), rules, {
		parserOpts,
		plugins: {
			"commitlint-plugin-function-rules": functionRules
		}
	});

test("a valid commit message", async () => {
	const { valid, errors, warnings } = await lintMessage(
		"feat(RCD-1): a valid commit message"
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});

test("a valid multi line commit", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(RCD-1): a valid angular commit with a scope

     Some content in the body`
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});

test("a leading blank line after header", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(RCD-1): a valid angular commit with a scope
     Some content in the body`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("body must have leading blank line");
	expect(warnings).toStrictEqual([]);
});

test("an invalid scope", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`no: no is not not an invalid commit type`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe(
		"type must be one of [build, ci, docs, feat, fix, perf, refactor, revert, style, test]"
	);
	expect(warnings).toStrictEqual([]);
});

test("no type", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`feat: no is not not an invalid commit type`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("a scope must be set");
	expect(warnings).toStrictEqual([]);
});

test("an invalid type", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`feat(heya): no is not not an invalid commit type`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("scope must be upper-case");
	expect(warnings).toStrictEqual([]);
});

test("an invalid jira id", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`feat(HEYA): no is not not an invalid commit type`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("scope must be a JIRA issue ID");
	expect(warnings).toStrictEqual([]);
});

test("a long header", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(RCD-1): that its an error when there is ia realllllllllllllllllllllly long header`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe(
		"header must not be longer than 72 characters, current length is 86"
	);
	expect(warnings).toStrictEqual([]);
});

test("message header with ! in it", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test!: with a breaking change in the type`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("a scope must be set");
	expect(warnings).toStrictEqual([]);
});

test("message header with ! in it and a scope", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(RCD-1)!: with a breaking change in the type`
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});

test("a subject must be set", async () => {
	const { valid, errors, warnings } = await lintMessage(`test(RCD-1):`);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("a subject must be set");
	expect(warnings).toStrictEqual([]);
});

test("a colon must be set", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(RCD-1) dwadwadwa`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("a subject must be set");
	expect(warnings).toStrictEqual([]);
});

test("JIRA ID key must be upper case", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`test(rcd-1): a valid commit message`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe("scope must be upper-case");
	expect(warnings).toStrictEqual([]);
});

test("you should be able to revert commits", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`revert(RCD-2): feat(RCD-1): a valid commit message`
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});

test("revert commits should have the full commit name that is being reverted", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`revert(RCD-1): a valid commit message`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe(
		"revert commits should have the full commit name that is being reverted"
	);
	expect(warnings).toStrictEqual([]);
});

test("revert commits should have the associated JIRA ID", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`revert: test(RCD-1): a valid commit message`
	);

	expect(valid).toBe(false);
	expect(errors[0].message).toBe(
		"revert commits should have the associated JIRA ID includes in the revert scope"
	);
	expect(warnings).toStrictEqual([]);
});

test("you should be able to revert commits and make breaking changes in them", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`revert(RCD-2)!: feat(RCD-1): a valid commit message`
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});

test("you should be able to revert commits that have breaking changes and make breaking changes in them", async () => {
	const { valid, errors, warnings } = await lintMessage(
		`revert(RCD-2)!: feat(RCD-1)!: a valid commit message`
	);

	expect(valid).toBe(true);
	expect(errors).toStrictEqual([]);
	expect(warnings).toStrictEqual([]);
});
