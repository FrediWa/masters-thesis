class LoggerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = []; // Temporary storage for accumulating data
        this.chunkSize = 16384; // Desired chunk size
    }

    process(inputs, outputs) {
        const input = inputs[0]; // Single input channel

        if (input.length > 0) {
            console.log("input", input);
            this.buffer.push(...input[0]);
            if (this.buffer.length >= this.chunkSize) {
                console.log(this.buffer);
            }
        }

        return true; 
    }
}

registerProcessor('accumulate-processor', AccumulateProcessor);
        