interface CreateComputerDto {
  employeeId?: number;
  brand: string;
  processor?: string;
  memory?: string;
  licenceKey?: string;
  note?: string;
}

export default CreateComputerDto;
