import Entity from "../entity";

interface DeletedEquipmentDto extends Entity {
  name: string;
  unitsInStock: number;
  unitsInRemaining: number;
}

export default DeletedEquipmentDto;
