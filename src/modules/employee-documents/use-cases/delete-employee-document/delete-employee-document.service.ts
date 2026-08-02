import { Injectable, NotFoundException } from '@nestjs/common';
import { IEmployeeDocumentRepository } from '../../domain/employee-document.repository.interface';

@Injectable()
export class DeleteEmployeeDocumentService {
  constructor(
    private readonly employeeDocumentRepository: IEmployeeDocumentRepository,
  ) {}

  async execute(employeeId: string, documentTypeId: string): Promise<void> {
    const employeeDocument =
      await this.employeeDocumentRepository.findByEmployeeAndDocumentType(
        employeeId,
        documentTypeId,
      );

    if (!employeeDocument) {
      throw new NotFoundException(
        `Employee "${employeeId}" is not linked to document type "${documentTypeId}".`,
      );
    }

    await this.employeeDocumentRepository.delete(employeeId, documentTypeId);
  }
}
