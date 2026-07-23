export const ERROR_MESSAGES = {
  BAD_REQUEST: 'The Request Is Invalid. Please Check Your Input.',
  UNAUTHORIZED: 'You Are Not Authorized. Please Log In Again.',
  FORBIDDEN: 'You Do Not Have Permission To Perform This Action.',
  NOT_FOUND: 'The Requested Resource Was Not Found.',
  CONFLICT: 'A Conflict Occurred. The Resource Already Exists.',
  INTERNAL_SERVER_ERROR: 'A Server Error Occurred. Please Try Again Later.',
  NETWORK_ERROR: 'Unable To Connect To The Server. Please Check Your Network Connection.',
  UNKNOWN_ERROR: 'An Unexpected Error Occurred. Please Try Again.',
  INVALID_CREDENTIALS: 'Invalid Username Or Password.',
  LOGIN_SUCCESSFUL: 'Login Successful...!',
  USER_CREATED: 'User Created Successfully.',
  USER_UPDATED: 'User Updated Successfully.',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

