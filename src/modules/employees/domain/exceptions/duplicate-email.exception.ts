export class DuplicateEmailException extends Error {
  constructor(email: string) {
    super(`An employee with email "${email}" already exists.`);
    this.name = 'DuplicateEmailException';
  }
}
