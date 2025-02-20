import visualize from "./visualize.js";
import { FFTJS } from "./fftjs.js";

//---snippet-start-A
function hps(array, maxHarmonics) {
    const harmonicProductSpectrum = new Float32Array(array.length/(maxHarmonics + 2));
    harmonicProductSpectrum.fill(1); // Multiplicative identity for HPS. 

    for (let harmonic = maxHarmonics; harmonic >= 1; harmonic--) {
        for (let i = 0; i < harmonicProductSpectrum.length; i++) {
            harmonicProductSpectrum[i] *= array[i*harmonic];
        }
    }
    
    return harmonicProductSpectrum; 
}
//---snippet-end-A
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
    // console.log("PP", largest, largestIndex);
    const frequency = largestIndex * binSize;
    const midiNumber = Math.round(12*Math.log2(frequency/440) + 69);
    return [midiNumber, frequency];
}

function getSpectrum(dataBuffer, fftWindowSize) {
    const square = (x) => x*x;
    const FFT = new FFTJS(fftWindowSize);

    // console.time("fft")
    // console.log("fft input", dataBuffer)
    const transform  = FFT.createComplexArray();
    FFT.realTransform(transform, dataBuffer);
    
    // Create spectrum from FFT transform values.
    const spectrum = new Float32Array(fftWindowSize);
    for (let i = 0; i < 16384; i++) {
        spectrum[i] = Math.sqrt(square(transform[2*i])+square(transform[2*i+1]))
    }

    // console.timeEnd("fft");

    return spectrum;
}

function getNoteName(midiNumber) {
    // const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"]
    const SEMITONES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "B", "H"]
    const letter = SEMITONES[midiNumber % 12];
    const octaveNumber = parseInt(midiNumber /12) -1;

    return "" + letter + octaveNumber;
}

export { hps, postProcess, getSpectrum, getNoteName }