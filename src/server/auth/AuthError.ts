export class AuthError extends Error {
  constructor(message = "Sign in first.") {
    super(message);
    this.name = "AuthError";
  }
}
