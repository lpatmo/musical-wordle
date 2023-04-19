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
        modalContent = <span>{children}</span>
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
                <button className={styles.modalXClose} onClick={handleClose}>
                    <CloseIcon />
                </button>
                {modalContent}
                {!warning && <button className={styles.modalCloseBtn} onClick={handleClose}>
                    Close
                </button>}
                {shareResults &&
                    <button
                        className="shareButton"
                        onClick={() => {
                            shareResults();
                        }}
                    >
                        Share <ShareIcon className={styles.shareIcon} />
                    </button>
                }
            </div>
            <div className={styles.modalOverlay}></div>
        </>
    )

}

export default Modal;