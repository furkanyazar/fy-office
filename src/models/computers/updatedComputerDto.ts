import Entity from "../entity";

interface UpdatedComputerDto extends Entity {
  brand: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  hasLicence: boolean;
}

export default UpdatedComputerDto;
