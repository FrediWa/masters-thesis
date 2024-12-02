import { FFTJS } from '../fftjs.js'

export class FFTProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.FFTWindowSize = 16384;
        this.targetSampleSize = 6000;
        this.samplesGathered = 0;
        this.buffer = new Float32Array(this.FFTWindowSize);   
        this.spectrumBuffer = new Float32Array(this.FFTWindowSize);
        this.readIndexOffset = 0;

        this.fft = new FFTJS(this.FFTWindowSize);
    }

    process(inputs, outputs) {
        const input = inputs[0]; 
        const output = outputs[0]; 
        const inputBuffer = input[0];

        if (input.length > 0) {
            console.log(inputBuffer);
            // Copy samples from input to internal buffer.
            for(let i = 0; i < inputBuffer.length; i++) {
                this.buffer[i + this.samplesGathered] = inputBuffer[i]
            }

            this.samplesGathered += inputBuffer.length;
            
            if (this.samplesGathered >= this.targetSampleSize) {
                
                // Zero pad starting at the last index.
                this.buffer.fill(0, this.samplesGathered, this.FFTWindowSize)
            
                this.fft.realTransform(this.spectrumBuffer, this.buffer);
                
                this.samplesGathered = 0;
            } 

            // Copy spectrum data from ring buffer to output.
            const frameSize = 128;
            for (let i = 0; i < frameSize; i++) {
                output[i] = this.spectrumBuffer[i + this.readIndexOffset]; 
            }
            this.readIndexOffset += frameSize;
            this.readIndexOffset %= this.FFTWindowSize;
        }

        return true; 
    }
}

registerProcessor('FFTprocessor', FFTProcessor);
