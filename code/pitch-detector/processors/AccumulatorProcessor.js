export class AccumulatorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.FFTWindowSize = 16384;
        this.targetSampleSize = 6000;
        this.samplesGathered = 0;
        this.buffer = new Float32Array(this.FFTWindowSize);   
        this.readIndexOffset = 0;
    }

    process(inputs) {
        const input = inputs[0];
        const inputBuffer = input[0];
        this.port.postMessage(inputBuffer);
    }

}

registerProcessor('AccumulatorProcessor', AccumulatorProcessor);