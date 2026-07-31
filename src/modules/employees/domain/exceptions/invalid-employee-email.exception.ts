export class InvalidEmployeeEmailException extends Error {
  constructor() {
    super('Employee email must be a valid email address.');
    this.name = 'InvalidEmployeeEmailException';
  }
}
