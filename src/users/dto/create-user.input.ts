import { MinLength, MaxLength, IsEmail, IsNotEmpty,Matches, IsString } from 'class-validator';
import { User } from '../../../graphql';
import { IsUnique } from 'src/validator/custom-rules';

export class CreateUserInput extends User {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  firstname: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique("user", "email")
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[a-z]/, {
    message: 'Le mot de passe doit comporter au moins une lettre minuscule',
  })
  @Matches(/[A-Z]/, {
    message: 'Le mot de passe doit comporter au moins une lettre majuscule',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit comporter au moins un chiffre',
  })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Le mot de passe doit comporter au moins un caractère spécial',
  })
  password: string;
}
