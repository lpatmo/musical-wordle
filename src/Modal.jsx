import React, { useRef, useEffect } from 'react';
import styles from './Modal.module.css'
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from '@mui/icons-material/Close';

function Modal({ children, shareResults, handleClose, warning }) {
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

    if (typeof children === "string") {
        modalContent = <p>{children}</p>
    } else if (Array.isArray(children)) {
        modalContent = (
            <ul className={styles.stats}>
                {children.map((item, index) => {
                    return (
                        <li key={index}>{item.title} - {item.guesses}/6 tries</li>
                    )
                })}
            </ul>
        )
        console.log('modalContent', modalContent)
    }

    return (
        <>
            <div className={`${styles.modal} ${warning && styles.warning}`} ref={modalRef}>
                <div>
                <button className={styles.modalXClose} onClick={handleClose}>
                    <CloseIcon />
                </button>
                {modalContent}
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
                {!warning && <button className={styles.modalCloseBtn} onClick={handleClose}>
                    Close
                </button>}
                </div>
              

            </div>
            <div className={styles.modalOverlay}></div>
        </>
    )

}

export default Modal;