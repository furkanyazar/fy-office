import Entity from "../entity";

interface CreatedEmployeeDto extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export default CreatedEmployeeDto;
