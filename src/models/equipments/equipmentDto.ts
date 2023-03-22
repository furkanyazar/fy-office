import Entity from "../entity";

interface EquipmentDto extends Entity {
  name: string;
  unitsInStock: number;
  unitsInRemaining: number;
}

export default EquipmentDto;
