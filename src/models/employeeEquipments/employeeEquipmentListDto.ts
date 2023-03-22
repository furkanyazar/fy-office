import Entity from "../entity";

interface EmployeeEquipmentListDto extends Entity {
  employeeId: number;
  equipmentId: number;
}

export default EmployeeEquipmentListDto;
