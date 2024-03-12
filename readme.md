# Auth0 Automated Tests Example
This repo provides examples on how to create automated tests for Auth0's custom database scripts and actions using Node's native test runner, [test](https://nodejs.org/api/test.html). To run the tests, you will need to have Node.js version >= 20.11.1 installed on your machine.

## Requirements

We'll simulate a simple API that we can use to log in, sign up, get user information and delete users. Here's each endpoint we'll need to consider:


### Sign Up

- Endpoint: `POST /signup`
- Body:
  - `email`: The user's email
  - `password`: The user's password
  - `passwordConfirmation`: The user's password confirmation
- Response:
  - ✅ **Success**:
    - **status**: 201
    - **body**: 
      - `id`: The user's id
  - ❌ **Error**: 
    - **status**: 400 | 500
    - **body**: 
      - `error`: The error message

### Log In
- Endpoint: `POST /login`
- Body:
  - `email`: The user's email
  - `password`: The user's password
- Response:
  - ✅ **Success**:
    - **status**: 200
    - **body**: 
      - `token`: The user's JWT
  - ❌ **Error**: 
    - **status**: 400 | 500
    - **body**: 
      - `error`: The error message

### Get User Information
- Endpoint: `GET /user`
- Headers:
  - `Authorization`: The user's JWT
- Response:
  - ✅ **Success**:
    - **status**: 200
    - **body**: 
      - `id`: The user's id
      - `email`: The user's email
  - ❌ **Error**: 
    - **status**: 400 | 500
    - **body**: 
      - `error`: The error message

### Delete User
- Endpoint: `DELETE /user`
- Headers:
  - `Authorization`: The user's JWT
- Response:
  - ✅ **Success**:
    - **status**: 204
  - ❌ **Error**: 
    - **status**: 400 | 500 | 404
    - **body**: 
      - `error`: The error message


