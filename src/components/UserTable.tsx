import { useState, useRef, useMemo } from 'react';
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
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { type EnhancedUser } from "../types/user";

type Props = {
    data: EnhancedUser[];
};

const UserTable = ({ data }: Props) => {
    const ROW_HEIGHT = 48;
    const OVERSCAN_COUNT = 10;
    const [sorting, setSorting] = useState<SortingState>([]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const columns = useMemo<ColumnDef<EnhancedUser>[]>(() => [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "firstName", header: "First Name" },
        { accessorKey: "lastName", header: "Last Name" },
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "registeredDate", header: "Registered Date" },
        { accessorKey: "dsr", header: "DSR" },
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN_COUNT,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div className="h-[90vh] border border-solid rounded-md overflow-hidden">
            <div
                ref={tableContainerRef}
                className="h-full overflow-auto"
            >
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
                                                    asc: <ArrowUp size={16} />,
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

                        {virtualItems.length > 0 && (
                            <TableRow style={{
                                padding: 0,
                                border: 'none',
                                height: `${virtualItems[0]?.start ?? 0}px`
                            }} aria-hidden="true">
                                <TableCell className='p-0 border-none' colSpan={columns.length} />
                            </TableRow>
                        )}

                        {virtualItems.map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <TableRow key={row.id} className="h-12">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className='text-left'>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}

                        {virtualItems.length > 0 && (
                            <TableRow style={{
                                padding: 0,
                                border: 'none',
                                height: `${virtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)}px`
                            }}>
                                <TableCell className='p-0 border-none' colSpan={columns.length}></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;