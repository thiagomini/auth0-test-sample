const { test, describe } = require('node:test');
const { mockFn } = require('../utils/mock-extended');
const { AxiosSpy, HttpMethod } = require('../utils/axios.spy');
const { randomUUID } = require('node:crypto');
const { create } = require('../../databases/Database/create');

describe('Create user script', () => {
  test('successfully creates a user', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mockFn();
    const axiosSpy = new AxiosSpy();

    // Act
    await create(user, callback, axiosSpy);

    // Assert
    callback.shouldHaveBeenCalledOnceWith(null);
  });
  test('calls axios post with correct parameters', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mockFn();
    const axiosSpy = new AxiosSpy();

    // Act
    await create(user, callback, axiosSpy);

    // Assert
    axiosSpy
      .shouldHaveSentNumberOfRequests(1)
      .withUrl(new URL('https://backend/signup'))
      .withMethod(HttpMethod.Post)
      .withBody({
        email: user.email,
        password: user.password,
        passwordConfirmation: user.password,
      });
  });
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
