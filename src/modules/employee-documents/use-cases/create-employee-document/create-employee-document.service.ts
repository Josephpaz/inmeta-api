import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentTypeRepository } from 'src/modules/document-types/domain/document-type.repository.interface';
import { IEmployeeRepository } from 'src/modules/employees/domain/employee.repository.interface';
import { EmployeeDocument } from '../../domain/employee-document.entity';
import { DuplicateEmployeeDocumentException } from '../../domain/exceptions/duplicate-employee-document.exception';
import { IEmployeeDocumentRepository } from '../../domain/employee-document.repository.interface';

interface CreateEmployeeDocumentInput {
  employeeId: string;
  documentTypeId: string;
}

@Injectable()
export class CreateEmployeeDocumentService {
  constructor(
    private readonly employeeDocumentRepository: IEmployeeDocumentRepository,
    private readonly employeeRepository: IEmployeeRepository,
    private readonly documentTypeRepository: IDocumentTypeRepository,
  ) {}

  async execute(input: CreateEmployeeDocumentInput): Promise<EmployeeDocument> {
    const employee = await this.employeeRepository.findById(input.employeeId);

    if (!employee) {
      throw new NotFoundException(
        `Employee with id "${input.employeeId}" not found.`,
      );
    }

    if (employee.isDeleted) {
      throw new GoneException(
        `Employee with id "${input.employeeId}" was removed.`,
      );
    }

    const documentType = await this.documentTypeRepository.findById(
      input.documentTypeId,
    );

    if (!documentType) {
      throw new NotFoundException(
        `Document type with id "${input.documentTypeId}" not found.`,
      );
    }

    if (documentType.isDeleted) {
      throw new GoneException(
        `Document type with id "${input.documentTypeId}" was removed.`,
      );
    }

    const existing =
      await this.employeeDocumentRepository.findByEmployeeAndDocumentType(
        input.employeeId,
        input.documentTypeId,
      );

    if (existing) {
      throw new DuplicateEmployeeDocumentException(
        input.employeeId,
        input.documentTypeId,
      );
    }

    const employeeDocument = EmployeeDocument.create({
      employeeId: input.employeeId,
      documentTypeId: input.documentTypeId,
    });

    return this.employeeDocumentRepository.create(employeeDocument);
  }
}
