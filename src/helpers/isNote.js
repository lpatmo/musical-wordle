export default function isNote(str) {
    //console.log('isNote str', str)
    return str.length <= 2 && "abcdefg".includes(str[0].toLowerCase());
}