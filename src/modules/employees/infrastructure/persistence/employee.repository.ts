import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Employee } from '../../domain/employee.entity';
import {
  EmployeeRepository,
  FindManyEmployeesParams,
  FindManyEmployeesResult,
} from '../../domain/employee.repository.interface';
import { EmployeeMapper } from './employee.mapper';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(employee: Employee): Promise<Employee> {
    const employeePrisma = await this.prisma.employee.create({
      data: {
        id: randomUUID(),
        ...EmployeeMapper.toPersistence(employee),
      },
    });

    return EmployeeMapper.toDomain(employeePrisma);
  }

  async delete(employee: Employee): Promise<void> {
    await this.prisma.employee.update({
      where: { id: employee.id },
      data: { deletedAt: employee.deletedAt },
    });
  }

  async findById(id: string): Promise<Employee | null> {
    const employeePrisma = await this.prisma.employee.findUnique({
      where: { id },
    });

    return employeePrisma ? EmployeeMapper.toDomain(employeePrisma) : null;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employeePrisma = await this.prisma.employee.findUnique({
      where: { email },
    });

    return employeePrisma ? EmployeeMapper.toDomain(employeePrisma) : null;
  }

  async findMany(
    params: FindManyEmployeesParams,
  ): Promise<FindManyEmployeesResult> {
    const skip = (params.page - 1) * params.pageSize;
    const take = params.pageSize;

    const where = {
      deletedAt: null,
      ...(params.name && {
        name: { contains: params.name, mode: 'insensitive' as const },
      }),

      ...(params.email && {
        email: { contains: params.email, mode: 'insensitive' as const },
      }),
    };

    const [total, employees] = await this.prisma.$transaction([
      this.prisma.employee.count({ where }),

      this.prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      data: employees.map(EmployeeMapper.toDomain),
    };
  }
}
