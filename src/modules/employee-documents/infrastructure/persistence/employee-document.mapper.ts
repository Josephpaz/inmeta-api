import { EmployeeDocument as PrismaEmployeeDocument } from '@prisma/client';
import { EmployeeDocument } from '../../domain/employee-document.entity';

export class EmployeeDocumentMapper {
  static toDomain(raw: PrismaEmployeeDocument): EmployeeDocument {
    return EmployeeDocument.create(
      { employeeId: raw.employeeId, documentTypeId: raw.documentTypeId },
      { id: raw.id, createdAt: raw.createdAt },
    );
  }

  static toPersistence(employeeDocument: EmployeeDocument) {
    return {
      employeeId: employeeDocument.employeeId,
      documentTypeId: employeeDocument.documentTypeId,
    };
  }
}
