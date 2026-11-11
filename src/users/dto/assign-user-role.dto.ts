import { IsInt, Min } from 'class-validator';

export class AssignUserRoleDto {
  @IsInt()
  @Min(1)
  role_id: number;

  @IsInt()
  @Min(1)
  scope_id: number;
}
