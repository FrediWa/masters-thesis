export class VizProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.samplesGathered = 0;
        this.targetSampleSize = 16384;   
    }

    process(inputs) {

        const input = inputs[0]; 
        const inputBuffer = input[0];

        if (input.length > 0) {
            this.port.postMessage(inputBuffer); 

            this.samplesGathered += inputBuffer.length;
            
            if (this.samplesGathered >= this.targetSampleSize) {
                this.port.postMessage("VISUALIZE"); 
                this.samplesGathered = 0;
            }
        }

        return true
    }
}

registerProcessor('VizProcessor', VizProcessor);