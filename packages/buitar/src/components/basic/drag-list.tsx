import { FC } from 'react'
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DragDropContextProps,
	type DroppableProps,
} from 'react-beautiful-dnd'

export type DragableListProps = {
	list: any[]
	className?: string
} & Pick<DroppableProps, 'direction'> &
	Pick<DragDropContextProps, 'onDragEnd'>

export const DragableList: FC<DragableListProps> = ({
	list,
	onDragEnd,
	className,
	direction = 'horizontal',
}) => {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable" direction={direction}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef} className={className}>
						{list.map((item, index) => (
							<Draggable key={index} draggableId={index.toString()} index={index}>
								{(provided) => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										{item}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	)
}
