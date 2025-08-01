import { useState, useRef, useCallback, useEffect } from 'react';
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
    type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { type EnhancedUser } from "../types/user";
import { getEnhancedUsers } from '@/utils/generateUser';
import { UserColumnDefinition } from "@/utils/constants"

const UserTable = () => {
    const INITIAL_DATA_SIZE = 100
    const CHUNK_SIZE = 100
    const MAX_USERS = 1000
    const ROW_HEIGHT = 48;
    const OVERSCAN_COUNT = 10;

    const [users, setUsers] = useState<EnhancedUser[]>(() => getEnhancedUsers(INITIAL_DATA_SIZE));
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>([
        'id', 'firstName', 'lastName', 'fullName', 'email', 'city', 'registeredDate', 'dsr'
    ]);
    const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
    const tableContainerRef = useRef(null);

    const fetchUsers = () => {
        if (users.length >= MAX_USERS) return;
        const newUsers = getEnhancedUsers(CHUNK_SIZE, users.length);
        setUsers((prev) => [...prev, ...newUsers]);
    };

    const reorderedColumns = columnOrder
        .map((columnId) => UserColumnDefinition.find((col) => col.id === columnId)!)

    const table = useReactTable({
        data: users,
        columns: reorderedColumns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableColumnResizing: false
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN_COUNT,
    });

    const virtualItems = virtualizer.getVirtualItems();

    useEffect(() => {
        const lastItem = virtualItems.at(-1);
        if (lastItem && lastItem.index >= users.length - 10) {
            fetchUsers();
        }
    }, [virtualItems, users]);

    const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
        e.preventDefault();
        if (!draggedColumnId || draggedColumnId === targetColumnId) return;
        const oldIndex = columnOrder.indexOf(draggedColumnId);
        const newIndex = columnOrder.indexOf(targetColumnId);
        const newOrder = [...columnOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, draggedColumnId);
        setColumnOrder(newOrder);
        setDraggedColumnId(null);
    }, [draggedColumnId, columnOrder]);

    return (
        <div className="h-[90vh] border border-solid rounded-md overflow-hidden">
            <div
                ref={tableContainerRef}
                className="h-full overflow-auto"
            >
                <Table className="bg-white-200 relative w-full" style={{ width: table.getCenterTotalSize() }}>
                    <TableHeader className="bg-gray-300 sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        style={{ width: header.getSize() }}
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        draggable
                                        onDragStart={() => setDraggedColumnId(header.id)}
                                        onDragOver={(e) => { e.preventDefault(); }}
                                        onDrop={(e) => handleDrop(e, header.id)}
                                        onDragEnd={() => { setDraggedColumnId(null) }}
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
                                height: `${virtualItems[0]?.start ?? 0}px`
                                }}>
                                <TableCell className='p-0 border-none' colSpan={UserColumnDefinition.length} />
                            </TableRow>
                        )}

                        {virtualItems.map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <TableRow key={row.id} className="h-12">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} style={{ width: cell.column.getSize() }} className='text-left'>
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
                                <TableCell className='p-0 border-none' colSpan={UserColumnDefinition.length}></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default UserTable;