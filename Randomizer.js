export default class Randomizer {

    constructor(seed) {

        this.getNumber = this.mulberry32(seed);
    }
    
    mulberry32(a) {
        // Credit: https://github.com/cprosche/mulberry32
        return function() {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
}

// let day = new Date();
// for (let i = 1; i < 365; i++) {
//     day.setDate(day.getDate() + 1);
//     console.log(day.toDateString());
// }