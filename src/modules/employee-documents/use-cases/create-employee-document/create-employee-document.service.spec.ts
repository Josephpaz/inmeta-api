import { GoneException, NotFoundException } from '@nestjs/common';
import { DocumentType } from 'src/modules/document-types/domain/document-type.entity';
import { IDocumentTypeRepository } from 'src/modules/document-types/domain/document-type.repository.interface';
import { Employee } from 'src/modules/employees/domain/employee.entity';
import { IEmployeeRepository } from 'src/modules/employees/domain/employee.repository.interface';
import { EmployeeDocument } from '../../domain/employee-document.entity';
import { DuplicateEmployeeDocumentException } from '../../domain/exceptions/duplicate-employee-document.exception';
import { IEmployeeDocumentRepository } from '../../domain/employee-document.repository.interface';
import { CreateEmployeeDocumentService } from './create-employee-document.service';

describe('CreateEmployeeDocumentService', () => {
  let service: CreateEmployeeDocumentService;
  let employeeDocumentRepository: jest.Mocked<IEmployeeDocumentRepository>;
  let employeeRepository: jest.Mocked<IEmployeeRepository>;
  let documentTypeRepository: jest.Mocked<IDocumentTypeRepository>;

  const employee = Employee.create(
    { name: 'Jane Doe', email: 'jane.doe@example.com' },
    { id: 'employee-1', createdAt: new Date(), updatedAt: new Date() },
  );
  const documentType = DocumentType.create(
    { name: 'CPF' },
    { id: 'document-type-1', createdAt: new Date(), updatedAt: new Date() },
  );

  beforeEach(() => {
    employeeDocumentRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findByEmployeeAndDocumentType: jest.fn(),
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

    service = new CreateEmployeeDocumentService(
      employeeDocumentRepository,
      employeeRepository,
      documentTypeRepository,
    );
  });

  it('creates the link when the employee and document type exist and are not linked yet', async () => {
    employeeRepository.findById.mockResolvedValue(employee);
    documentTypeRepository.findById.mockResolvedValue(documentType);
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      null,
    );
    employeeDocumentRepository.create.mockImplementation((link) =>
      Promise.resolve(link),
    );

    const result = await service.execute({
      employeeId: 'employee-1',
      documentTypeId: 'document-type-1',
    });

    expect(result).toBeInstanceOf(EmployeeDocument);
    expect(employeeDocumentRepository.create).toHaveBeenCalledTimes(1);
  });

  it('throws NotFoundException when the employee does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({
        employeeId: 'missing',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(employeeDocumentRepository.create).not.toHaveBeenCalled();
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

    expect(employeeDocumentRepository.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when the document type does not exist', async () => {
    employeeRepository.findById.mockResolvedValue(employee);
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(
      service.execute({ employeeId: 'employee-1', documentTypeId: 'missing' }),
    ).rejects.toThrow(NotFoundException);

    expect(employeeDocumentRepository.create).not.toHaveBeenCalled();
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
    employeeRepository.findById.mockResolvedValue(employee);
    documentTypeRepository.findById.mockResolvedValue(deletedDocumentType);

    await expect(
      service.execute({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(GoneException);

    expect(employeeDocumentRepository.create).not.toHaveBeenCalled();
  });

  it('throws DuplicateEmployeeDocumentException when the link already exists', async () => {
    employeeRepository.findById.mockResolvedValue(employee);
    documentTypeRepository.findById.mockResolvedValue(documentType);
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      EmployeeDocument.create({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    );

    await expect(
      service.execute({
        employeeId: 'employee-1',
        documentTypeId: 'document-type-1',
      }),
    ).rejects.toThrow(DuplicateEmployeeDocumentException);

    expect(employeeDocumentRepository.create).not.toHaveBeenCalled();
  });
});
