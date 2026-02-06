import { useDrag } from 'react-dnd/dist';

interface Props {
    inc: any;
    onDelete: (id: number) => void;
}

export const IncidentCard = ({ inc, onDelete }: Props) => {
    // 1. Define the drag hook
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'INCIDENT',     // This must match the 'accept' type in the column
        item: { id: inc.id }, // The data passed to the drop target
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(), // Are we currently holding this?
        }),
    }));

    return (
        <div
            ref={(node) => { dragRef(node); }} // This tells React "This element is the handle"
            className="incident-card"
            style={{ opacity: isDragging ? 0.4 : 1 }}
        >
            {inc.title}
            <button
                onClick={() => onDelete(inc.id)}
                className="delete-btn"
            >
                Resolve Incident
            </button>
        </div>
    );
};