# eslint-eslines

Utility that makes easier to combine ESLint with ESLines in certain environments.

## Rationale

ESLint and ESLines play well together:

	eslint -f json <files to lint> | eslines

Yet, UNIX pipes may not play well with environments that allow parallelization. For example, in CircleCI you are allowed to execute the same command over a different set of files in parallel:

	lint-command :
		parallel: true
		files:
		- client/**/*.js
		- client/**/*.jsx
		- server/**/*.js
		- server/**/*.jsx

In those cases, UNIX piping does not help, hence this utility.
