import { useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import Modal from './Modal'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const storage = JSON.parse(localStorage.getItem("stats"));
    console.log('storage', storage)

    function countFreqOfGuesses() {
        const counter = new Array(7).fill(0);
        storage.forEach((curr) => {
            if (curr.guesses === "X") {
                counter[0]++; //The 0th element is the number of losses
            } else {
                counter[curr.guesses]++;
            }
        });
        return counter;
    }
    let counter = countFreqOfGuesses();

    function findPercentageWon() {
        const numWon = storage.length - counter[0];
        return `${(numWon/storage.length * 100).toFixed(2)}%`;
    }

    return (
        <div className={styles.navbar}>
            <img src="/pitch_puzzle.svg" alt="Pitch Puzzle logo"/>
            <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
            {isOpen && <Modal handleClose={() => setIsOpen(false)}>
                {storage.length} played
                <p>Percentage won: {findPercentageWon()}</p>
                <p>{counter[1]}</p>
                <p>{counter[2]}</p>
                <p>{counter[3]}</p>
                <p>{counter[4]}</p>
                <p>{counter[5]}</p>
                <p>{counter[6]}</p>
                
            </Modal>}
        </div>
    )
}

export default Navbar;