import Entity from "../entity";

interface CreatedComputerDto extends Entity {
  brand: string;
  employeeFirstName?: string;
  employeeLastName?: string;
  hasLicence: boolean;
}

export default CreatedComputerDto;
