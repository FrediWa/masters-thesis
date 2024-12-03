import { FFTJS } from '../fftjs.js'

export class FFTProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.FFTWindowSize = 16384;
        this.targetSampleSize = 6000;
        this.samplesGathered = 0;
        this.buffer = new Float32Array(this.FFTWindowSize);   
        this.readIndexOffset = 0;
        
        this.fft = new FFTJS(this.FFTWindowSize);
        this.spectrumBuffer = this.fft.createComplexArray();
    }

    process(inputs, outputs) {
        const input = inputs[0]; 
        const output = outputs[0]; 
        const inputBuffer = input[0];
        const outputBuffer = output[0];

        if (input.length > 0) {
            // console.log(inputBuffer);
            // Copy samples from input to internal buffer.
            for(let i = 0; i < inputBuffer.length; i++) {
                this.buffer[i + this.samplesGathered] = inputBuffer[i]
            }

            this.samplesGathered += inputBuffer.length;
            // console.log(this.samplesGathered, this.targetSampleSize);
            if (this.samplesGathered >= this.targetSampleSize) {
                
                // Zero pad starting at the last index.
                this.buffer.fill(0, this.samplesGathered, this.FFTWindowSize)
                // console.log("yo", this.buffer   );
                
                this.fft.realTransform(this.spectrumBuffer, this.buffer);
                // console.log(this.spectrumBuffer);
                
                this.samplesGathered = 0;
            } 

            // Convert complex coeffiecients to spectrum data and copy to output.
            const renderQuantumSize = 128;
            let currentSampleReal = 0;
            let currentSampleImaginary = 0;
            const square = (x) => x*x;

            for (let i = 0; i < renderQuantumSize; i++) {
                // The FFT.js output array is [real0, img0, real1, img1, ...].
                currentSampleReal = this.spectrumBuffer[i + this.readIndexOffset];
                currentSampleImaginary = this.spectrumBuffer[i + this.readIndexOffset + 1];
                
                outputBuffer[i] = Math.sqrt(square(currentSampleReal) + square(currentSampleImaginary)); 
            }
            console.log("FFT Processor out", output);
            this.readIndexOffset += renderQuantumSize;
            this.readIndexOffset %= this.FFTWindowSize;
        }
        
        return true; 
    }
}

registerProcessor('FFTprocessor', FFTProcessor);
