import styles from './ModalInstructions.module.css'
import Modal from './Modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
} from "@fortawesome/free-solid-svg-icons";

function ModalInstructions({ setIsOpen }) {
    return (
        <Modal handleClose={() => setIsOpen(false)} hideClose={true}>
            <section className={styles.modalInstructions}>
                <h2>How to play</h2>
                <ul>
                    <li>Play the tune and identity the first 6 notes in 6 tries.</li>
                </ul>
                <h3>Tips</h3>
                <ul>
                    <li>Click on the <button
                            className={styles.playButton}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                        </button> button to listen to your guess</li>
                    <li>
                        <div className={styles.exampleTiles}>
                            <span>B</span>
                            <span>B</span>
                            <span className={styles.correct}>G</span>
                            <span>F</span>
                            <span>F</span>
                            <span>F</span>
                        </div>
                        You've identified a correct note and it's in the correct spot.</li>
                    <li>
                        <div className={styles.exampleTiles}>
                            <span>B</span>
                            <span className={styles.misplaced}>G</span>
                            <span>A</span>
                            <span>F</span>
                            <span>F</span>
                            <span>F</span>
                        </div>
                        You've identified a correct note but it's in the wrong spot.</li>
                    <li>      <div className={styles.exampleTiles}>
                        <span>B</span>
                        <span>B</span>
                        <span>D</span>
                        <span>F</span>
                        <span className={styles.incorrect}>D</span>
                        <span>D</span>
                    </div>
                        The note you've identified is not in the tune.</li>
                </ul>
                <p>A new musical puzzle is released daily at midnight.</p>
            </section>
        </Modal>
    )
}

export default ModalInstructions;