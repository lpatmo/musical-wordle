import { useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import Modal from './Modal'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const storage = JSON.parse(localStorage.getItem("stats"));

    return (
        <div className={styles.navbar}>
            <img src="/pitch_puzzle.svg" alt="Pitch Puzzle logo"/>
            <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
            {isOpen && <Modal handleClose={() => setIsOpen(false)}>{storage}</Modal>}
        </div>
    )
}

export default Navbar;