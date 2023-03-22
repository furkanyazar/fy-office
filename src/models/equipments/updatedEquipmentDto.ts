import Entity from "../entity";

interface UpdatedEquipmentDto extends Entity {
  name: string;
  unitsInStock: number;
  unitsInRemaining: number;
}

export default UpdatedEquipmentDto;
