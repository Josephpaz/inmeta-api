import { HttpStatus } from '@nestjs/common';

export abstract class DomainException extends Error {
  constructor(
    message: string,
    public readonly status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
  }
}
