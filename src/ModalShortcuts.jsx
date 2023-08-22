import styles from './ModalInstructions.module.css'
import Modal from './Modal'

function ModalShortcuts({ setIsOpen }) {
    return (
        <Modal handleClose={() => setIsOpen(false)} hideClose={true}>
            <section className={styles.modalInstructions}>
                    <h3>Keyboard Shortcuts</h3>
                    <p>Available keys: <strong>C D E F G A B</strong> </p>
                    <p>Press <strong>Shift-</strong> to guess a sharp or flat <br /> if you think it's in the tune. For example:</p>
                    <p><strong>Shift-C</strong> results in <strong>C#</strong> if there are sharps</p>
                    <p><strong>Shift-B</strong> results in <strong>Bb</strong> if there are flats</p>
            </section>
        </Modal>
    )
}

export default ModalShortcuts;