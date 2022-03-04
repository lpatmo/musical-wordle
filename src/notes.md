# Musical Wordle

## MVP

1. User hits "play" button and 6 musical notes play via the web audio API
2. User guesses each of the notes and hits enter
      2a. Validation: Only ABCDEFG letters accepted
      2b. Stretch goal: Can select natural, sharp, or minor for each note
      2c. After typing in a letter, automatically focus on the next input
      2d. If I hit backspace, focus on previous letter
3. If a note is in the correct place, change input background to green
4. If the note is in the musical sequence but not in the right place, change input background to yellow
5. If the note is not in the musical sequence, input background is gray

## Stretch Goals

6. Stretch goal: 6 guesses
   7a. If they guess right before all six tries, show celebration
   7b. If after six tries they guess wrong, show failure state
7. Stretch: keyboard at the bottom showing you which notes you played
8. Stretch: animation after you type a guess and hit enter
9. Stretch: for extra points, these are the first 6 notes of which song?
10. Stretch: login and accounts
    11a. Stretch: dashboard of your game stats (e.g. % of wins)
11. Stretch: After playing
12. Stretch: click to copy results to clipboard after playing game
13. Stretch: a new musical sequence is chosen every day from the data file
14. Stretch: musical hint -- "It is one of these three songs"
15. Stretch: save guesses in localStorage, so that if I refresh the page I see my guesses saved.
16. Let user hear what they typed if they click on a sound button on the right of the tiles

## Issues Blocking MVP

- Allow for 6 total guess (no more, no less)

  - See the answer after guessing six times (none of it right)
    - disable/disappear submission button after six guesses
  - If you get it right, you can't make any more guess
    - disable/disappear submission button after correct answer submitted
    - victory message/notification

- (SMALL) Display six empty rows when game starts
- (MEDIUM) Display the guesses in the grid as they are submitted
- No editing of previous guesses

- (MEDIUM) Backspace should shift focus to previous input square if current input square is empty

- (MEDIUM) Make mobile friendly/make responsive

- (SMALL) Refactor JS in Board.js in line 64 (there are two joins that do the same thing; there's a neater way to write the)
