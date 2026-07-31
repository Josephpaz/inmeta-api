import { Employee as PrismaEmployee } from '@prisma/client';
import { Employee } from '../../domain/employee.entity';

export class EmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      { name: raw.name, email: raw.email },
      {
        id: raw.id,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt,
      },
    );
  }

  static toPersistence(employee: Employee) {
    return {
      name: employee.name,
      email: employee.email,
      deletedAt: employee.deletedAt,
    };
  }
}
