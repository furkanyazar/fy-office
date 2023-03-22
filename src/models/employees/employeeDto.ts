import Entity from "../entity";

interface EmployeeDto extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  computerBrand?: string;
  computerHasLicence: boolean;
}

export default EmployeeDto;
