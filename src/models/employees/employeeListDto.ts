import Entity from "../entity";

interface EmployeeListDto extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export default EmployeeListDto;
