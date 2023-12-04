/**
 * Return a playable note
 * @params {object} event
 * @params {boolean} hasFlats 
 * @return {str}
 */

 export default function getNoteWithOctave(event, hasFlats, octave) {
    /* If the shift key is pressed down and a relevant note
    inside sharpsMapping or flatsMapping is played, return
    the matching sharp or flat. Otherwise, return the
    note as is plus '.'. For example, B is "B."
    */
    const sharpsMapping = {
        "C": "C#",
        "D": "D#",
        "F": "F#",
        "G": "G#",
        "A": "A#"
    }
    const flatsMapping = {
        "D": "Db",
        "E": "Eb",
        "G": "Gb",
        "A": "Ab",
        "B": "Bb"
    }
    if (event.shiftKey) {
        if (hasFlats) {
            if (Object.keys(flatsMapping).includes(event.key)) {
                return flatsMapping[event.key] + octave
            }
        } else {
            if (Object.keys(sharpsMapping).includes(event.key)) {
                return sharpsMapping[event.key] + octave
            }
        }
    }
    return event.key + octave;   
}