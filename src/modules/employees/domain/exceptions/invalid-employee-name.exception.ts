export class InvalidEmployeeNameException extends Error {
  constructor() {
    super('Employee name must not be empty.');
    this.name = 'InvalidEmployeeNameException';
  }
}
