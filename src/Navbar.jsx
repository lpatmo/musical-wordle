import { useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import Modal from './Modal'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const storage = JSON.parse(localStorage.getItem("stats"));
    console.log('storage!!!', Array.isArray(storage))

    return (
        <div className={styles.navbar}>
            <h1>Ear Training Daily</h1>
            <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
            {isOpen && <Modal handleClose={() => setIsOpen(false)}>{storage}</Modal>}
        </div>
    )
}

export default Navbar;