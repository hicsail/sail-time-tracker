import CollapsibleEmployeeTable from "@pages/Report/CollapsibleEmployeeTable";
import CollapsibleProjectTable from "@pages/Report/CollapsibleProjectTable";

export const Report = () => {
  return (
    <div>
      <CollapsibleEmployeeTable />
      <CollapsibleProjectTable />
    </div>
  )
}