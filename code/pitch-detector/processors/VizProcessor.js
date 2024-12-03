export class VizProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.samplesGathered = 0;
        this.targetSampleSize = 16384;   
    }

    process(inputs, output) {

        const input = inputs[0]; 
        const inputBuffer = input[0];

        if (input.length > 0) {
            console.log("Viz Processor input", inputBuffer);
            this.port.postMessage(inputBuffer); 

            this.samplesGathered += inputBuffer.length;
            
            if (this.samplesGathered >= this.targetSampleSize) {
                this.samplesGathered = 0;
            }
        }

        return true
    }
}

registerProcessor('VizProcessor', VizProcessor);