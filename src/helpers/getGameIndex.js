import { differenceInDays } from 'date-fns';
import { data } from '../data/data.js';

/**
 * Return the readable instrument value
 * @params {string} instrument
 * @return {str}
 */

 export default function getGameIndex() {
    let startDate = new Date('2023-08-05');
    startDate.setHours(0, 0, 0, 0);
    // Find number of days between now and startDate
    const daysDifference = differenceInDays(new Date(), startDate) - 1 > 0 ? differenceInDays(new Date(), startDate) - 1 : 0;
    // if the daysDifference exceeds the total # of songs in the data array, return the mod of the length of the array
    return daysDifference % data.length;
  }