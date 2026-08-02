import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { EmployeeDocumentsModule } from './modules/employee-documents/employee-documents.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    EmployeesModule,
    DocumentTypesModule,
    EmployeeDocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
