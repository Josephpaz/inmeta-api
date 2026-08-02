import { NotFoundException } from '@nestjs/common';
import { EmployeeDocument } from '../../domain/employee-document.entity';
import { IEmployeeDocumentRepository } from '../../domain/employee-document.repository.interface';
import { DeleteEmployeeDocumentService } from './delete-employee-document.service';

describe('DeleteEmployeeDocumentService', () => {
  let service: DeleteEmployeeDocumentService;
  let employeeDocumentRepository: jest.Mocked<IEmployeeDocumentRepository>;

  beforeEach(() => {
    employeeDocumentRepository = {
      create: jest.fn(),
      delete: jest.fn(),
      findByEmployeeAndDocumentType: jest.fn(),
    };

    service = new DeleteEmployeeDocumentService(employeeDocumentRepository);
  });

  it('deletes the link when it exists', async () => {
    const link = EmployeeDocument.create({
      employeeId: 'employee-1',
      documentTypeId: 'document-type-1',
    });
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      link,
    );

    await service.execute('employee-1', 'document-type-1');

    expect(employeeDocumentRepository.delete).toHaveBeenCalledWith(
      'employee-1',
      'document-type-1',
    );
  });

  it('throws NotFoundException when the link does not exist', async () => {
    employeeDocumentRepository.findByEmployeeAndDocumentType.mockResolvedValue(
      null,
    );

    await expect(
      service.execute('employee-1', 'document-type-1'),
    ).rejects.toThrow(NotFoundException);

    expect(employeeDocumentRepository.delete).not.toHaveBeenCalled();
  });
});
