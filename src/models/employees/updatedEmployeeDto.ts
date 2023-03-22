import Entity from "../entity";

interface UpdatedEmployeeDto extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export default UpdatedEmployeeDto;
