import { useState, useContext } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import ModalStats from './ModalStats';
import CountdownTimer from './CountdownTimer';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.navbar}>
            <img src="/logo_transparent.svg" alt="Perfect Pitch Puzzle logo" className={styles.logo} />
            {/* <span className={styles.instructions}>Figure out the first few notes of the tune. You have 6 tries.</span> */}
            <img src="/instructions_transparent.svg" alt="Identity the first 6 notes of the tune. You have 6 tries." width="450" />
                <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
                <CountdownTimer />
            {isOpen && <ModalStats setIsOpen={setIsOpen} />}

        </div>
    )
}

export default Navbar;