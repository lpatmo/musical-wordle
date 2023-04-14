import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Grid from '@mui/material/Grid';
import styles from './Navbar.module.css';

function Navbar() {
    return (
        <Grid container justifyContent="flex-end" className={styles.navbar}>
            <SettingsIcon />
        </Grid>
    )
}

export default Navbar;