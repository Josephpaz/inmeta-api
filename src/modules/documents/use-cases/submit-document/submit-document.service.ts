import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentTypeRepository } from 'src/modules/document-types/domain/document-type.repository.interface';
import { IEmployeeDocumentRepository } from 'src/modules/employee-documents/domain/employee-document.repository.interface';
import { IEmployeeRepository } from 'src/modules/employees/domain/employee.repository.interface';
import { Document } from '../../domain/document.entity';
import { IDocumentRepository } from '../../domain/document.repository.interface';

interface SubmitDocumentInput {
  employeeId: string;
  documentTypeId: string;
}

@Injectable()
export class SubmitDocumentService {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly employeeRepository: IEmployeeRepository,
    private readonly documentTypeRepository: IDocumentTypeRepository,
    private readonly employeeDocumentRepository: IEmployeeDocumentRepository,
  ) {}

  async execute(input: SubmitDocumentInput): Promise<Document> {
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

    const link =
      await this.employeeDocumentRepository.findByEmployeeAndDocumentType(
        input.employeeId,
        input.documentTypeId,
      );

    if (!link) {
      throw new NotFoundException(
        `Employee "${input.employeeId}" is not required to submit document type "${input.documentTypeId}".`,
      );
    }

    const latest =
      await this.documentRepository.findLatestByEmployeeAndDocumentType(
        input.employeeId,
        input.documentTypeId,
      );

    const document = Document.create({
      employeeId: input.employeeId,
      documentTypeId: input.documentTypeId,
      version: latest ? latest.version + 1 : 1,
    });

    return this.documentRepository.create(document);
  }
}
