const { test, describe, mock } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { create } = require('../../databases/Database/create');

describe('Create user script', () => {
  test('successfully creates a user', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mock.fn();

    // Act
    await create(user, callback);

    // Assert
    assert.equal(callback.mock.callCount(), 1);
    assert.deepEqual(callback.mock.calls[0].arguments, [null]);
  });
  test.todo('calls axios post with correct parameters');
  test.todo('throws validation error when user already exists');
  test.todo('throws error with descriptive message when something goes wrong');
});

function makeUserData() {
  return {
    email: 'user@mail.com',
    password: randomUUID(),
    tenant: 'test-tenant',
    client_id: 'test-client-id',
    connection: 'Database',
  };
}
