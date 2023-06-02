/**
 * Default handler function for API errors.
 *
 * @internal
 *
 * @param e - error returned from api request
 */
export function defaultHandleApiError(e: unknown) {
  console.error(e);
}
