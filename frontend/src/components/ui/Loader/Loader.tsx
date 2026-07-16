import { clsx } from 'clsx';

import styles from './Loader.module.scss';

interface LoaderProps {
	small?: boolean;
}

export const Loader = ({ small }: LoaderProps) => (
	<div className={styles.container}>
		<div className={clsx(styles.loader, small && styles.small)} />
	</div>
);

export const InlineLoader = () => (
	<div className={clsx(styles.loader, styles.small, styles.inline)} />
);
