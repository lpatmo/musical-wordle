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
                    <li>You have 6 tries.</li>
                </ul>
                <h3>Tips</h3>
                <ul>
                    <li>Click on the                   <button
                        className={styles.playButton}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                    </button> button to listen to your guess</li>
                    <li>Hit 'enter' or 'submit' to submit a guess</li>
                    <li><div className={`${styles.exampleTile} ${styles.correct}`}></div> – you've identified a correct note and it's in the correct spot.</li>
                    <li><div className={`${styles.exampleTile} ${styles.misplaced}`}></div> – you've identified a correct note and it's in the wrong spot.</li>
                    <li><div className={`${styles.exampleTile} ${styles.incorrect}`}></div> – the note you've identified is not in the solution.</li>

                </ul>
                <p>A new musical puzzle is released daily at midnight.</p>
            </section>
        </Modal>
    )
}

export default ModalInstructions;