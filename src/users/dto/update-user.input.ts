import { CreateUserInput } from './create-user.input';
import { OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {}
