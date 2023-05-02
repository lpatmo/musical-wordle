import React from 'react';
import ShareIcon from '@mui/icons-material/Share';
import styles from './ShareResults.module.css';

function ShareResults({ shareResults }) {
    return (
    <button
        className={styles.shareButton}
        onClick={() => {
            shareResults();
        }}
    >
        Share <ShareIcon className={styles.shareIcon} />
    </button>)
}

export default ShareResults;