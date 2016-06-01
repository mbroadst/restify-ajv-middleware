ifdef GREP
	GREPARG = -g $(GREP)
endif

REPORTER ?= spec
TESTS = ./tests
NPM_BIN = ./node_modules/.bin

lint:
	$(NPM_BIN)/eslint index.js tests

coverage:	lint
	$(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha --report lcovonly -- --recursive -t 20000 --ui tdd $(TESTS)

test:
	$(NPM_BIN)/mocha --globals setImmediate,clearImmediate --check-leaks --colors -t 20000 --reporter $(REPORTER) $(TESTS) $(GREPARG)

.PHONY: lint coverage test
