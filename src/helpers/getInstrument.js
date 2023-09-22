/**
 * Return the readable instrument value
 * @params {string} instrument
 * @return {str}
 */

export default function getInstrument(instrument) {
    const instrumentMapping = {
        "acoustic_grand_piano": "Piano 🎹",
        "violin": "Violin 🎻",
        "french_horn": "French Horn 📯",
        "choir_aahs": "Choir 🎤",
        "acoustic_guitar_steel": "Guitar 🎸",
        "bird_tweet": "Bird Tweet 🐦 (extra points)",
        "flute": "Flute 🌬️"
    }
    return instrumentMapping[instrument];
}