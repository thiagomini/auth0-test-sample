const assert = require('node:assert/strict');

/**
 * Asserts that a mocked function was called once with the expected arguments.
 * @param {Mock} mockedFn The mocked function created with `mock.fn()`
 * @param  {...any} expectedArguments The expected arguments the mocked function should have been called with
 */
function assertMockWasCalledOnceWith(mockedFn, ...expectedArguments) {
  assert.equal(mockedFn.mock.callCount(), 1);
  assert.deepEqual(mockedFn.mock.calls[0].arguments, expectedArguments);
}

module.exports = {
  assertMockWasCalledOnceWith,
};
