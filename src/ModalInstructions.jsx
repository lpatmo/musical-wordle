import styles from './ModalInstructions.module.css'
import Modal from './Modal'
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import HeadphonesIcon from '@mui/icons-material/Headphones';

function ModalInstructions({ setIsOpen }) {
    return (
        <Modal handleClose={() => setIsOpen(false)} hideClose={true}>
            <section className={styles.modalInstructions}>
                <h2>How to Play</h2>
                <ul>
                    <li>Play the tune! Then identify the first 6 notes. You have 6 tries.</li>
                </ul>
                <h3><AudiotrackIcon /> Tips</h3>
                <ul>
                    <li>
                        <div className={styles.exampleTiles}>
                            <span>B</span>
                            <span>B</span>
                            <span className={styles.correct}>G</span>
                            <span>F</span>
                            <span>F</span>
                            <span>F</span>
                        </div>
                        Correct note in the correct spot.</li>
                    <li>
                        <div className={styles.exampleTiles}>
                            <span>B</span>
                            <span className={styles.misplaced}>G</span>
                            <span>A</span>
                            <span>F</span>
                            <span>F</span>
                            <span>F</span>
                        </div>
                        Correct note in the wrong spot.</li>
                    <li>      <div className={styles.exampleTiles}>
                        <span>B</span>
                        <span>B</span>
                        <span>E</span>
                        <span>F</span>
                        <span className={styles.incorrect}>D</span>
                        <span>D</span>
                    </div>
                        The note is not in the tune.</li>
                        <li>Click on <button
                            className={styles.playButton}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <HeadphonesIcon />
                        </button> to listen to your guess before submitting a try.</li>
                </ul>
                <p>A new musical ear training puzzle is released daily at midnight.</p>
            </section>
        </Modal>
    )
}

export default ModalInstructions;