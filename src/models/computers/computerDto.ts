import Entity from "../entity";

interface ComputerDto extends Entity {
  employeeId?: number;
  brand: string;
  processor?: string;
  memory?: string;
  licenceKey?: string;
  note?: string;
  employeeFirstName?: string;
  employeeLastName?: string;
}

export default ComputerDto;
