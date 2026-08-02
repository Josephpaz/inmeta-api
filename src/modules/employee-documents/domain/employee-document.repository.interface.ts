import { EmployeeDocument } from './employee-document.entity';

export abstract class IEmployeeDocumentRepository {
  abstract create(
    employeeDocument: EmployeeDocument,
  ): Promise<EmployeeDocument>;
  abstract delete(employeeId: string, documentTypeId: string): Promise<void>;
  abstract findByEmployeeAndDocumentType(
    employeeId: string,
    documentTypeId: string,
  ): Promise<EmployeeDocument | null>;
}
