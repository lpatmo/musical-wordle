import { useEffect, useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import InfoIcon from '@mui/icons-material/Info';
import styles from './Navbar.module.css';
import ModalStats from './ModalStats';
import ModalInstructions from './ModalInstructions';
import CountdownTimer from './CountdownTimer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import SongSelector from './SongSelector'

function Navbar({ showCountdown, songID, handleAnswer, showSongSelector=true, maxSongSelect = Infinity }) {
    const [showStats, setShowStats] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("perfectPitchPuzzleStats"));
        let hasVisited = sessionStorage.getItem("perfectPitchPuzzleHasVisited");

        if (!storage && !hasVisited) {
            setShowInstructions(true);
            sessionStorage.setItem("perfectPitchPuzzleHasVisited", "true");
        }
    }, [])


    return (
        <div className={styles.navbar}>
            <img src="/logo_transparent.svg" alt="Perfect Pitch Puzzle logo" className={styles.logo} />
            {/* <span className={styles.instructions}>Figure out the first few notes of the tune. You have 6 tries.</span> */}
            {/* <img src="/instructions_transparent.svg" className={styles.note} alt="Identity the first 6 notes of the tune. You have 6 tries." width="380" /> */}

            <InfoIcon onClick={() => setShowInstructions(true)} style={{ fontSize: 40 }} />
            <EqualizerIcon onClick={() => setShowStats(true)} style={{ fontSize: 40 }} />
            <a href="https://discord.gg/8k3zA8nbsE" target="_blank" referrer="no-referrer" className="discordIcon mobileShow"><FontAwesomeIcon icon={faDiscord} aria-labelledby="Join us on Discord" /></a>
            {/* <a href="https://discord.gg/8k3zA8nbsE" target="_blank" referrer="no-referrer" className={styles.discordIcon}><FontAwesomeIcon icon={faDiscord} /></a> */}
            {showCountdown && <CountdownTimer />}
            {showStats && <ModalStats setIsOpen={setShowStats} />}
            {showInstructions && <ModalInstructions setIsOpen={setShowInstructions} />}
            {showSongSelector && <SongSelector songID={songID} handleAnswer={handleAnswer} maxSongSelect={maxSongSelect} />}
        </div>
    )
}

export default Navbar;