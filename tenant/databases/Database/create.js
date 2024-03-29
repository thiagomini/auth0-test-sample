module.exports.create = async function create(
  user,
  callback,
  axios = require('axios')
) {
  // This script should create a user entry in your existing database. It will
  // be executed when a user attempts to sign up, or when a user is created
  // through the Auth0 dashboard or API.
  // When this script has finished executing, the Login script will be
  // executed immediately afterwards, to verify that the user was created
  // successfully.
  //
  // The user object will always contain the following properties:
  // * email: the user's email
  // * password: the password entered by the user, in plain text
  // * tenant: the name of this Auth0 account
  // * client_id: the client ID of the application where the user signed up, or
  //              API key if created through the API or Auth0 dashboard
  // * connection: the name of this database connection
  //
  // There are three ways this script can finish:
  // 1. A user was successfully created
  //     callback(null);
  // 2. This user already exists in your database
  //     callback(new ValidationError("user_exists", "my error message"));
  // 3. Something went wrong while trying to reach your database
  //     callback(new Error("my error message"));

  const { email, password } = user;

try {
  await axios.post(new URL('https://backend/signup'), {
    email,
    password,
    passwordConfirmation: password,
  });
} catch (error) {
  if (error.response?.status === 404)
    return callback(new ValidationError('user_exists', 'User already exists'));

  return callback(
    new Error(
      `Something went wrong while trying to sign up user (${error.message})`
    )
  );
}
  return callback(null);
};
