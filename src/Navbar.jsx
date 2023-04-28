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
        return `${(numWon / storage.length * 100).toFixed(2)}%`;
    }

    const maxGuesses = Math.max(...counter);
    console.log('maxGuesses', maxGuesses)
    console.log('counter4', typeof counter[4])

    return (
        <div className={styles.navbar}>
            <img src="/pitch_puzzle.svg" alt="Pitch Puzzle logo" />
            <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
            {isOpen &&
                <Modal handleClose={() => setIsOpen(false)} hideClose={true}>
                    <section>
                        <ul className={styles.statsSummary}>
                            <li><span>{storage.length} </span><span className={styles.statsLabel}>Played</span></li>
                            <li><span>{findPercentageWon()} </span><span className={styles.statsLabel}>Percentage won</span></li>
                        </ul>

                        <h5 className={styles.title}>Guess Distribution</h5>
                        <div className={styles.barChart}>
                            <div>
                                <span>1</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[1] == 0 && 0}</span>
                                <span className={counter[1] == 0 ? styles.hide : styles.bar} style={{width: `${counter[1]/maxGuesses*100}%`}}>{counter[1] > 0 && counter[1]}</span>
                            </div>
                            <div>
                                <span>2</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[2] == 0 && 0}</span>
                                <span className={counter[2] == 0 ? styles.hide : styles.bar} style={{width: `${counter[2]/maxGuesses*100}%`}}>{counter[2]}</span>
                            </div>
                            <div>
                                <span>3</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[3] == 0 && 0}</span>
                                <span className={counter[3] == 0 ? styles.hide : styles.bar} style={{width: `${counter[3]/maxGuesses*100}%`}}>{counter[3]}</span>
                            </div>
                            <div>
                                <span>4</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[4] == 0 && 0}</span>
                                <span className={counter[4] == 0 ? styles.hide : styles.bar} style={{width: `${counter[4]/maxGuesses*100}%`}}>{counter[4] > 0 && counter[4]}</span>
                            </div>
                            <div>
                                <span>5</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[5] == 0 && 0}</span>
                                <span className={counter[5] == 0 ? styles.hide : styles.bar} style={{width: `${counter[5]/maxGuesses*100}%`}}>{counter[5]}</span>
                            </div>
                            <div>
                                <span>6</span>
                                <span className={styles.bar} style={{width: "30px"}}>{counter[6] == 0 && 0}</span>
                                <span className={counter[6] == 0 ? styles.hide : styles.bar} style={{width: `${counter[6]/maxGuesses*100}%`}}>{counter[6]}</span>
                            </div>
                        </div>
                    </section>

                </Modal>}
        </div>
    )
}

export default Navbar;