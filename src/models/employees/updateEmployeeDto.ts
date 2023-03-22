import Entity from "../entity";

interface UpdateEmployeeDto extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  equipments: number[];
}

export default UpdateEmployeeDto;
