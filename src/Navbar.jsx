import { useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import ModalStats from './ModalStats';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.navbar}>
            <img src="/pitchpuzzle_newlogo.svg" alt="Perfect Pitch Puzzle logo" />
            <span className={styles.instructions}>Figure out the first few notes of the tune. You have 6 tries.</span>
            <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
            {isOpen && <ModalStats setIsOpen={setIsOpen} />}
        </div>
    )
}

export default Navbar;