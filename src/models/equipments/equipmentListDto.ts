import Entity from "../entity";

interface EquipmentListDto extends Entity {
  name: string;
  unitsInStock: number;
  unitsInRemaining: number;
}

export default EquipmentListDto;
