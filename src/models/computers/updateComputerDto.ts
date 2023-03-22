import Entity from "../entity";

interface UpdateComputerDto extends Entity {
  employeeId?: number;
  brand: string;
  processor?: string;
  memory?: string;
  licenceKey?: string;
  note?: string;
}

export default UpdateComputerDto;
