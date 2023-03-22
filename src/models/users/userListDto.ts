import Entity from "../entity";

interface UserListDto extends Entity {
  firstName: string;
  lastName: string;
  email: string;
  status: boolean;
}

export default UserListDto;
