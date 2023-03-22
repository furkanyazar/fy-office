import Entity from "../entity";

interface UpdateUserDto extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export default UpdateUserDto;
