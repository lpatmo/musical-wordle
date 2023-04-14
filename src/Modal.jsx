import React from 'react';
import styles from './Modal.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faX,
    faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

function Modal({ message, shareResults, removeModal }) {
    return (
        <>
            <div className={styles.modal}>
                <button className={styles.modalXClose} onClick={removeModal}>
                    <FontAwesomeIcon icon={faX} />
                </button>
                <p>{message}</p>
                <button className={styles.modalCloseBtn} onClick={removeModal}>
                    Close
                </button>
                <button
                    className="shareButton"
                    onClick={() => {
                        shareResults();
                    }}
                >
                    Share <FontAwesomeIcon icon={faShareAlt}></FontAwesomeIcon>
                </button>
            </div>
            {message && <div className={styles.modalOverlay}></div>}
        </>
    )

}

export default Modal;