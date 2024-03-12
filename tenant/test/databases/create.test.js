const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Create user script', () => {
  test.todo('successfully creates a user');
  test.todo('calls axios post with correct parameters');
  test.todo('throws validation error when user already exists');
  test.todo('throws error with descriptive message when something goes wrong');
});
