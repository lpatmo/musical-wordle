import { Soundfont } from "smplr";

const context = new AudioContext();
const piano = new Soundfont(context, { instrument: "acoustic_grand_piano" });

/**
 * Plays a sequence of notes
 * @params {object} answer
 * @params {array} guess
 * @params {integer} currentRow
 * @return 
 */
export function playSequence(answer, guess, currentRow, volume) {
    // console.log('====answer and guess and currentRow, volume', answer, guess, currentRow, volume)
    //Stop any previous melodies from playing
    piano.stop();
    piano.output.setVolume(volume * 18);
    piano.loaded().then(() => {
        const now = context.currentTime;

        answer.sequence.slice(0, 6).forEach((note, i) => {
            const transformedNote = guess !== undefined && guess[currentRow][i] !== '' ? guess[currentRow][i] + note.substring(1, 2) : note;

            piano.start(
                {
                    note: transformedNote,
                    time: now + answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4,
                    duration: answer.duration[i] / 4
                }
            );
        });
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
    marimba.output.setVolume(volume * 18);

    marimba.loaded().then(() => {
        const now = context.currentTime;
        answer.sequence.forEach((note, i) => {
            marimba.start({ note, time: now + answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, duration: answer.duration[i] / 4 });
        });
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
    marimba.output.setVolume(volume * 18);

    marimba.loaded().then(() => {
        const octave = answer.sequence[currentNote].slice(1, 2);
        const now = context.currentTime;
        marimba.start({ note: `${note.toUpperCase()}${octave}`, time: now, duration: 0.5 });
    })
    return;
}
