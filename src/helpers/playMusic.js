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
     //console.log('====answer and guess and currentRow, volume', answer, guess, currentRow, volume)
    //Stop any previous melodies from playing
    piano.stop();
    piano.output.setVolume(volume * 35);
    piano.loaded().then(() => {
        const now = context.currentTime;

        answer.sequence.slice(0, 6).forEach((note, i) => {
            const transformedNote = guess !== undefined && guess[currentRow][i*2] !== '' ? guess[currentRow].slice(i*2, 2*(i+1)).split('.')[0] + note.slice(-1) : note;
            //console.log('====transformedNote', transformedNote) 
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
    piano.output.setVolume(volume * 35);

    piano.loaded().then(() => {
        const now = context.currentTime;
        answer.sequence.forEach((note, i) => {
            piano.start({ note, time: now + answer.duration.slice(0, i).reduce((a, b) => a + b, 0) / 4, duration: answer.duration[i] / 4 });
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
    console.log('PLAYING NOTE note', note)
    console.log('PLAYNOTE answer', answer)
    console.log('PLAYNOTE currentNote', currentNote)
    piano.output.setVolume(volume * 35);

    piano.loaded().then(() => {
        const octave = answer.sequence[currentNote].slice(-1);
        const now = context.currentTime;
        piano.start({ note: `${note}${octave}`, time: now, duration: 0.5 });
    })
    return;
}
