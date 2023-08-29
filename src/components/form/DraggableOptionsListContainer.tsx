import React from "react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import DragHandleIcon from '@mui/icons-material/DragHandle';

export interface DraggableListProps<T> {
    items: T[]
    mapItem: (item: T, index: number) => React.ReactNode
    onOrderChanged: (newItems: T[]) => void
}

export const DraggableOptionsListContainer = <T,>(
    { items, mapItem, onOrderChanged }: DraggableListProps<T>
) => {

    const onDragEnd = ({ destination, source }: DropResult) => {
        if (!destination) return;

        const newItems = reorder(items, source.index, destination.index); // Hier müssen Sie die reorder-Funktion definieren

        onOrderChanged(newItems);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-list">
                {provided => (
                    <div ref={provided.innerRef} style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }} {...provided.droppableProps}>
                        {items.map((item, index) => (
                            <Draggable key={index.toString()} draggableId={index.toString()} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 20,
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            {mapItem(item, index)}
                                            <DragHandleIcon />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

function reorder<T>(
    list: T[],
    startIndex: number,
    endIndex: number
): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export default DraggableOptionsListContainer;