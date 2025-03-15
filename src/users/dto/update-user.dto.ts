// filepath: /home/spuentesp/contentful-api/src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'john_doe', description: 'The username of the user', required: false })
  username?: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user', required: false })
  email?: string;

  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user', required: false })
  password?: string;
}