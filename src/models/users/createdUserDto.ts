import Entity from "../entity";

interface CreatedUserDto extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export default CreatedUserDto;
