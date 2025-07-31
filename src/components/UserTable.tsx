import {useState} from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "./ui/table";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { type EnhancedUser } from "../types/user";

type Props = {
    data: EnhancedUser[];
};

const UserTable = ({ data }: Props) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<EnhancedUser>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "registeredDate", header: "Registered Date" },
        { accessorKey: "dsr", header: "DSR" },
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="h-[90vh] border border-solid rounded-md overflow-hidden">
            <div className="h-full overflow-auto">
                <Table className="bg-white-200 relative">
                    <TableHeader className="bg-gray-300 sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            <span>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </span>
                                            <span className='ml-1'>
                                                {{
                                                    asc: <ArrowUp size={16}/>,
                                                    desc: <ArrowDown size={16} />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </span>
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="h-12">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-left">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;