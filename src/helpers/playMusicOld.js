

import Soundfont from 'soundfont-player';

/**
 * Plays a sequence of note
 * @params {object} answer
 * @params {array} guess
 * @params {integer} currentRow
 * @return 
 */

export function playSequence(answer, guess, currentRow, volume) {
    //console.log('answer and guess and currentRow', answer, guess, currentRow, volume)
    const ac = new AudioContext();

    const transformedSequence = answer.sequence.slice(0,6).map((note, i) => {
        const transformedNote = guess !== undefined && guess[currentRow][i] !== '' ? guess[currentRow][i] + note.substring(1, 2) : note;
        return { time: answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, note: transformedNote, duration: answer.duration[i] / 4 }
    }).filter((noteObj) => {
        return noteObj.note.length === 2;
    })

    Soundfont.instrument(ac, 'acoustic_grand_piano', {gain: volume}).then(function (piano) {
        piano.stop();
        piano.schedule(ac.currentTime, transformedSequence)
    })
    return;
}

/**
 * Play celebration
 * @params {object} answer
 * @params {array} guess
 * @params {integer} currentRow
 * @return 
 */

 export function playCelebrationSequence(answer, volume) {
    const ac = new AudioContext();

    const transformedSequence = answer.sequence.map((note, i) => {
        return { time: answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, note, duration: answer.duration[i] / 4 }
    })

    Soundfont.instrument(ac, 'acoustic_grand_piano', {gain: volume}).then(function (piano) {
        piano.stop();
        piano.schedule(ac.currentTime, transformedSequence)
    })
    return;
}

/**
 * Plays a single note
 * @params {string} note
 * @params {object} answer
 * @params {integer} currentRow
 * @return 
 */

export function playNote(note, answer, currentNote, volume) {
    if (currentNote === 6) {
        return;
    }
    const ac = new AudioContext();
    const octave = answer.sequence[currentNote].slice(1, 2)

    /*TODO: Consider adding an :active class to the piano key that was pressed*/
    Soundfont.instrument(ac, 'acoustic_grand_piano', {gain: volume}).then(function (piano) {
        piano.stop();
        piano.play(`${note.toUpperCase()}${octave}`, ac.currentTime, { duration: 0.5 })
    })
    return;
}