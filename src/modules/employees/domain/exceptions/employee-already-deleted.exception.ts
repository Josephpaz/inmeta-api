export class EmployeeAlreadyDeletedException extends Error {
  constructor() {
    super('Employee is already deleted.');
    this.name = 'EmployeeAlreadyDeletedException';
  }
}
