const { mock } = require('node:test');
const assert = require('node:assert/strict');

function mockFn() {
  const mockedFunction = mock.fn();
  mockedFunction.shouldHaveBeenCalledOnceWith = (expectedArgument) => {
    assert.equal(mockedFunction.mock.callCount(), 1);
    assert.deepEqual(
      mockedFunction.mock.calls[0].arguments[0],
      expectedArgument
    );
  };
  return mockedFunction;
}

module.exports = {
  mockFn,
};
