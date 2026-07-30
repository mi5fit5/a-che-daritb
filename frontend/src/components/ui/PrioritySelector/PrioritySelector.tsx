import React from 'react';

import type { TItemPriority } from '@types';
import { PRIORITY_WEIGHT } from '@types';

import styles from './PrioritySelector.module.scss';

interface PrioritySelectorProps {
	priority: TItemPriority;
	onChange: (priority: TItemPriority) => void;
}

const PRIORITY_LIST: TItemPriority[] = [
	'fun',
	'low',
	'medium',
	'high',
	'essential',
];

export const PrioritySelector: React.FC<PrioritySelectorProps> = ({
	priority,
	onChange,
}) => {
	const priorityWeight = PRIORITY_WEIGHT[priority];

	return (
		<div className={styles.selector}>
			<div className={styles.starsPreview}>
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={
							star <= priorityWeight ? styles.starFilled : styles.starEmpty
						}>
						★
					</span>
				))}
			</div>
			<input
				type='range'
				min='1'
				max='5'
				step='1'
				value={priorityWeight}
				className={styles.slider}
				onChange={(e) => {
					const val = parseInt(e.target.value);
					onChange(PRIORITY_LIST[val - 1]);
				}}
			/>
		</div>
	);
};
