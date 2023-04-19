import { useState } from 'react';
import EqualizerIcon from '@mui/icons-material/Equalizer'; import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';
import Modal from './Modal'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const storage = JSON.parse(localStorage.getItem("stats"));
    console.log('storage!!!', Array.isArray(storage))

    return (
        <Grid container style={{float: 'right'}}>
            <Grid item xs={12} justify="flex-end">
                <EqualizerIcon onClick={() => setIsOpen(true)} style={{ fontSize: 40 }} />
                {isOpen && <Modal handleClose={() => setIsOpen(false)}>{storage}</Modal>}
            </Grid>
        </Grid>

    )
}

export default Navbar;