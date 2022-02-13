

import Soundfont from 'soundfont-player';

export default function playSequence(answer, guess) {
    console.log('answer and guess', answer, guess)
    const ac = new AudioContext();

    //.slice(0, guess !== undefined ? guess.length : answer.sequence.length)
    const transformedSequence = answer.sequence.map((note, i) => {

        const transformedNote = guess !== undefined && guess[i] !== '' ? guess[i] + note.substring(1, 2) : note;
        console.log('transformedNotes', transformedNote)
        return { time: answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, note: transformedNote, duration: answer.duration[i] / 4 }
    }).filter((noteObj) => {
        return noteObj.note.length === 2;
    })
    console.log('transformedSequence', transformedSequence)

    Soundfont.instrument(ac, 'acoustic_grand_piano').then(function (piano) {
        piano.schedule(ac.currentTime, transformedSequence)
    })
}