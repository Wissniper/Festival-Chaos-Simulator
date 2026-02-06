import { useDrop } from 'react-dnd/dist';
import { IncidentCard } from '../IncidentCard';

interface Props {
    status: string;
    incidents: any[];
    onMove: (id: number, newStatus: string) => void;
    onDelete: (id: number) => void;
}

export const KanbanColumn = ({ status, incidents, onMove, onDelete }: Props) => {
    // 2. Define the drop hook
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'INCIDENT',
        drop: (item: { id: number }) => onMove(item.id, status),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={(node) => {
                dropRef(node)
            }}
            className={`column ${isOver ? 'highlight' : ''}`}
        >
            <h3>{status.replace('_', ' ')}</h3>
            {incidents.map(inc => (
                <IncidentCard key={inc.id} inc={inc} onDelete={onDelete} />
            ))}
        </div>
    );
};