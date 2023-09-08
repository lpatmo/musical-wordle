import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';

export default function Instruments({instrument, setInstrument}) {
    return (<>
        <InputLabel variant="standard" htmlFor="instrument">
            Instrument
        </InputLabel>
        <NativeSelect
            defaultValue={instrument}
            inputProps={{
                name: 'instrument',
                id: 'instrument',
            }}
            onChange={(e) => setInstrument(e.target.value)}
            sx={{ fontSize: '1.6rem', mr: '2em' }}
        >
            <option value="acoustic_grand_piano">Piano</option>
            <option value="choir_aahs">Choir</option>
            <option value="flute">Flute</option>
            <option value="french_horn">French Horn</option>
            <option value="acoustic_guitar_steel">Guitar</option>
            <option value="violin">Violin</option>
            <option value="bird_tweet">Bird Tweet</option>
        </NativeSelect></>)
}