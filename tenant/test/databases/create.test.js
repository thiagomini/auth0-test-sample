const { test, describe } = require('node:test');
const { mockFn } = require('../utils/mock-extended');
const { AxiosSpy, HttpMethod } = require('../utils/axios.spy');
const { randomUUID } = require('node:crypto');
const { create } = require('../../databases/Database/create');

global.ValidationError = class ValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};

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
  test('throws validation error when user already exists', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mockFn();
    const axiosSpy = new AxiosSpy();
    axiosSpy.stubResponseFor(
      HttpMethod.Post,
      new URL('https://backend/signup'),
      {
        status: 404,
        body: {
          error: 'user already exists',
        },
      }
    );

    // Act
    await create(user, callback, axiosSpy);

    // Assert
    callback.shouldHaveBeenCalledOnceWith(
      new ValidationError('user_exists', 'User already exists')
    );
  });
  test('throws error with descriptive message when something goes wrong', async () => {
    // Arrange
    const user = makeUserData();
    const callback = mockFn();
    const axiosSpy = new AxiosSpy();
    axiosSpy.stubUnexpectedErrorFor(
      HttpMethod.Post,
      new URL('https://backend/signup'),
      new Error('Network error')
    );

    // Act
    await create(user, callback, axiosSpy);

    // Assert
    callback.shouldHaveBeenCalledOnceWith(
      new Error(
        'Something went wrong while trying to sign up user (Network error)'
      )
    );
  });
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
