import { GoneException, NotFoundException } from '@nestjs/common';
import { DocumentType } from 'src/modules/document-types/domain/document-type.entity';
import { IDocumentTypeRepository } from 'src/modules/document-types/domain/document-type.repository.interface';
import { EmployeeDocument } from 'src/modules/employee-documents/domain/employee-document.entity';
import { IEmployeeDocumentRepository } from 'src/modules/employee-documents/domain/employee-document.repository.interface';
import { Employee } from 'src/modules/employees/domain/employee.entity';
import { IEmployeeRepository } from 'src/modules/employees/domain/employee.repository.interface';
import { Document } from '../../domain/document.entity';
import { IDocumentRepository } from '../../domain/document.repository.interface';
import { SubmitDocumentService } from './submit-document.service';

describe('SubmitDocumentService', () => {
  let service: SubmitDocumentService;
  let documentRepository: jest.Mocked<IDocumentRepository>;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let documentTypeRepository: jest.Mocked<IDocumentTypeRepository>;
  let employeeDocumentRepository: jest.Mocked<IEmployeeDocumentRepository>;

  const employee = Employee.create(
    { name: 'Jane Doe', email: 'jane.doe@example.com' },
    { id: 'employee-1', createdAt: new Date(), updatedAt: new Date() },
  );
  const documentType = DocumentType.create(
    { name: 'CPF' },
    { id: 'document-type-1', createdAt: new Date(), updatedAt: new Date() },
  );
  const link = EmployeeDocument.create({
    employeeId: 'employee-1',
    documentTypeId: 'document-type-1',
  });

  beforeEach(() => {
    documentRepository = {
      create: jest.fn(),
      findLatestByEmployeeAndDocumentType: jest.fn(),
      findPendingDocuments: jest.fn(),
    };

    employeeRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      restore: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findMany: jest.fn(),
    };

    documentTypeRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      restore: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findMany: jest.fn(),
    };

    employeeDocumentRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findByEmployeeAndDocumentType: jest.fn(),
    };

    service = new SubmitDocumentService(
      documentRepository,
      employeeRepository,
      documentTypeRepository,
      employeeDocumentRepository,
    );

    employeeRepository.findById.mockResolvedValue(employee);
    documentTypeRepository.findById.mockResolvedValue(documentType);
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      link,
    );
    documentRepository.create.mockImplementation((document) =>
      Promise.resolve(document),
    );
  });

  it('submits version 1 when there is no previous document', async () => {
    documentRepository.findLatestByEmployeeAndDocumentType.mockResolvedValue(
      null,
    );

    const result = await service.execute({
      employeeId: 'employee-1',
      documentTypeId: 'document-type-1',
    });

    expect(result).toBeInstanceOf(Document);
    expect(result.version).toBe(1);
  });

  it('submits the next version when a previous document exists', async () => {
    const previous = Document.create({
      employeeId: 'employee-1',
      documentTypeId: 'document-type-1',
      version: 3,
    });
    documentRepository.findLatestByEmployeeAndDocumentType.mockResolvedValue(
      previous,
    );

    const result = await service.execute({
      employeeId: 'employee-1',
      documentTypeId: 'document-type-1',
    });

    expect(result.version).toBe(4);
  });

  it('throws NotFoundException when the employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        employeeId: 'missing',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(documentRepository.create).not.toHaveBeenCalled();
  });

  it('throws GoneException when the employee is deleted', async () => {
    const deletedEmployee = Employee.create(
      { name: 'Jane Doe', email: 'jane.doe@example.com' },
      {
        id: 'employee-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    );
    employeeRepository.findById.mockResolvedValue(deletedEmployee);

    await expect(
      service.execute({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(GoneException);

    expect(documentRepository.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the document type does not exist', async () => {
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({ employeeId: 'employee-1', documentTypeId: 'missing' }),
    ).rejects.toThrow(NotFoundException);

    expect(documentRepository.create).not.toHaveBeenCalled();
  });

  it('throws GoneException when the document type is deleted', async () => {
    const deletedDocumentType = DocumentType.create(
      { name: 'CPF' },
      {
        id: 'document-type-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      },
    );
    documentTypeRepository.findById.mockResolvedValue(deletedDocumentType);

    await expect(
      service.execute({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(GoneException);

    expect(documentRepository.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the employee is not required to submit this document type', async () => {
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      null,
    );

    await expect(
      service.execute({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(documentRepository.create).not.toHaveBeenCalled();
  });
});
