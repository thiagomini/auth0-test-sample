const { test, describe } = require('node:test');
const { mockFn } = require('../utils/mock-extended');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { create } = require('../../databases/Database/create');

describe('Create user script', () => {
  test('successfully creates a user', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mockFn();

    // Act
    await create(user, callback);

    // Assert
    callback.shouldHaveBeenCalledOnceWith(null);
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
