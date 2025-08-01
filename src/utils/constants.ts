import { type ColumnDef } from "@tanstack/react-table"
import { type EnhancedUser } from "@/types/user";

export const UserColumnDefinition: ColumnDef<EnhancedUser>[] = [
  { accessorKey: "id", header: "ID", id: "id", enableResizing: false, size: 50, meta: {label: "ID"} },
  { accessorKey: "firstName", header: "First Name", id: "firstName", enableResizing: false, size: 150, meta: {label: "First Name"} },
  { accessorKey: "lastName", header: "Last Name", id: "lastName", enableResizing: false, size: 150, meta: {label: "Last Name"} },
  { accessorKey: "fullName", header: "Full Name", id: "fullName", enableResizing: false, size: 250, meta: {label: "Full Name"} },
  { accessorKey: "email", header: "Email", id: "email", enableResizing: false, size: 350, meta: {label: "Email"} },
  { accessorKey: "city", header: "City", id: "city", enableResizing: false, size: 250, meta: {label: "City"} },
  { accessorKey: "registeredDate", header: "Registered Date", id: "registeredDate", enableResizing: false, size: 150, meta: {label: "Registered Date"} },
  { accessorKey: "dsr", header: "DSR", id: "dsr", enableResizing: false, size: 55, meta: {label: "Date Since Registered"} },
];