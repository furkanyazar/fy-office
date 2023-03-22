import Entity from "../entity";

interface UpdateEquipmentDto extends Entity {
  name: string;
  unitsInStock: number;
  employees: number[];
}

export default UpdateEquipmentDto;
