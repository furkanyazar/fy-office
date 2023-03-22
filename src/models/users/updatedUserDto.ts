import Entity from "../entity";

interface UpdatedUserDto extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export default UpdatedUserDto;
