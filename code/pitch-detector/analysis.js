import visualize from "./visualize.js";
import { FFTJS } from "./fftjs.js";


//---snippet-start-B
function spectralFlatness(signal) {
    const N = signal.length;
    const logSum = signal.reduce((acc, value) => acc + Math.log(value + 0.01), 0);
    const sum = signal.reduce((acc, value) => acc + value, 0);
    const geometricMean = Math.exp(logSum/N);
    const arithmeticMean = sum/N;

    return geometricMean/arithmeticMean;
}

//---snippet-end-B

//---snippet-start-A
function hps(array, maxHarmonics) {
    const harmonicProductSpectrum = new Float32Array(array.length/maxHarmonics);
    harmonicProductSpectrum.fill(1); // Multiplicative identity for HPS. 

    for (let harmonic = 1; harmonic <= maxHarmonics; harmonic++) {
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

//---snippet-start-D
function getSpectrum(dataBuffer, fftWindowSize) {
    const square = (x) => x*x;
    const FFT = new FFTJS(fftWindowSize);

    const transform  = FFT.createComplexArray();
    FFT.realTransform(transform, dataBuffer);
    
    // Create spectrum from FFT transform values.
    const spectrum = new Float32Array(fftWindowSize);
    for (let i = 0; i < 16384; i++) {
        spectrum[i] = Math.sqrt(square(transform[2*i])+square(transform[2*i+1]))
    }

    return spectrum;
}
//---snippet-end-D


function isValidNote(checkFlatness, flatnessCriteria, hpsFlatnessCriteria, checkOutlier, midiNumber) {
    let isValid = true;

    if (checkFlatness) {
        // console.log("checking flatness");
        if (!flatnessCriteria) {
            isValid = false;
        }
    }

    if (checkFlatness) {
        // console.log("checking hps flatness");
        if (!hpsFlatnessCriteria) {
            isValid = false;
        }
    }
    
    if (checkOutlier) {
        // console.log("checking outliers");
        const C2 = 36, C6 = 84;
        if (midiNumber < C2 || midiNumber > C6) {
            isValid = false;
        }
    }

    return isValid;
}

function drawResults(canvasID, data) {
    console.log(data);
    data = data.filter(e => e != null);
    // console.log("draw", data);
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext("2d");
    
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / data.length;
    
    // Normalize data.
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);

    console.log(minVal);

    const range = maxVal - minVal || Number.MIN_VALUE; // Avoid division by zero
    
    // Visualize.
    data.forEach((value, index) => {
        const intensity = ((value - minVal) / range) * 100;
        console.log(value, intensity);
        // ctx.fillStyle = `hsl(0 0% 100%)`;
        ctx.fillStyle = `hsl(0 0% ${intensity}%)`;
        // console.log("fill", ctx.fillStyle);
        ctx.fillRect(index * barWidth, 0, barWidth, height);
    });
}


// const SEMITONES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "B", "H"]

//---snippet-start-C
function getNoteName(midiNumber, scale) {
    const letter = scale[midiNumber % 12];
    const octaveNumber = parseInt(midiNumber /12) -1;

    return "" + letter + octaveNumber;
}
//---snippet-end-C

function exponentialMovingAverage(data, alpha) {
    if (data.length === 0) return [];
    
    let emaArray = [];
    let prevEMA = data[0]; // Initialize with the first data point
    
    for (let i = 0; i < data.length; i++) {
        prevEMA = alpha * data[i] + (1 - alpha) * prevEMA;
        emaArray.push(prevEMA);
    }
    
    return emaArray;
}

function enchancePeaks(signal, alpha = 1.5) {
    const enhanced = new Array(signal.length).fill(0);
    const gapCellCount = 2;
    const refCellCount = 5;
    for (let i = 0; i < signal.length; i++) {
        // Define local reference window (excluding the target cell)
        let start = Math.max(0, i - windowSize);
        let end = Math.min(signal.length, i + windowSize);
        
        let refCells = signal.slice(start, end).filter((_, idx) => idx !== i - start);

        // Compute mean noise level
        let noiseLevel = refCells.length > 0 
            ? refCells.reduce((sum, val) => sum + val, 0) / refCells.length 
            : 0;

        // Apply CFAR thresholding (boost if above noise level)
        enhanced[i] = signal[i] > alpha * noiseLevel ? signal[i] * alpha : signal[i];
    }

    return enhanced;
}

export { hps, postProcess, getSpectrum, getNoteName, spectralFlatness, isValidNote, drawResults, exponentialMovingAverage}
