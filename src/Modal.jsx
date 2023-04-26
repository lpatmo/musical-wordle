import React, { useRef, useEffect } from 'react';
import styles from './Modal.module.css'
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';

function Modal({ children, shareResults, handleClose }) {
    const modalRef = useRef(null);
    let modalContent;

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleClose();
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleOutsideClick);

        return () => {
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [handleOutsideClick]);

    return (
        <>
            <div className={styles.modal} ref={modalRef}>
                <div>
                    <button className={styles.modalXClose} onClick={handleClose}>
                        <CloseIcon />
                    </button>
                    {children}
                </div>
                <div>
                    {shareResults &&
                        <button
                            className={styles.shareButton}
                            onClick={() => {
                                shareResults();
                            }}
                        >
                            Share <ShareIcon className={styles.shareIcon} />
                        </button>
                    }
                    <button className={styles.modalCloseBtn} onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
            <div className={styles.modalOverlay}></div>
        </>
    )

}

export default Modal;