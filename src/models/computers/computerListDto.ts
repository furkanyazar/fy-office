import Entity from "../entity";

interface ComputerListDto extends Entity {
  brand: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  hasLicence: boolean;
}

export default ComputerListDto;
