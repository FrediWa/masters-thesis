import visualize from "./visualize.js";

function hps(array, maxHarmonics) {
    const harmonicProductSpectrum = new Float32Array(array.length/(maxHarmonics + 2));
    harmonicProductSpectrum.fill(1); // Multiplicative identity for HPS. 

    for (let harmonic = maxHarmonics; harmonic >= 2; harmonic--) {

        for(let i = 0; i < harmonicProductSpectrum.length; i++) {
            harmonicProductSpectrum[i] *= array[i*harmonic];
        }
    }
    
    return harmonicProductSpectrum; 
}

function postProcess(array, binSize) {
    /*
    Conclusion:
    If you need your code to run fast, don't use indexOf(max). 
    reduce is ok but use the custom loop if you need the best performances.
    */
    // this was from some stack overflow post, can't remember the link.
    let largest = 0;
    let largestIndex = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {   
            largest = array[i];
            largestIndex = i;
        }
    }
    console.log("PP", largest, largestIndex)
    const frequency = largestIndex * binSize;
    const midiNumber = Math.round(12*Math.log2(frequency/440) + 69);
    return [midiNumber, frequency];
}

function getNoteName(midiNumber) {
    const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"]
    const letter = SEMITONES[midiNumber % 12];
    const octaveNumber = parseInt(midiNumber /12) -1;

    return "" + letter + octaveNumber;
}

export { hps, postProcess, getNoteName }