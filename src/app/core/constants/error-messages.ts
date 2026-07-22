export const ERROR_MESSAGES = {
  BAD_REQUEST: 'The request is invalid. Please check your input.',
  UNAUTHORIZED: 'You are not authorized. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'A conflict occurred. The resource already exists.',
  INTERNAL_SERVER_ERROR: 'A server error occurred. Please try again later.',
  NETWORK_ERROR:
    'Unable to connect to the server. Please check your network connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  INVALID_CREDENTIALS: 'Invalid username or password.',
  LOGIN_SUCCESSFULL:'Login Successful! Redirecting...',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
