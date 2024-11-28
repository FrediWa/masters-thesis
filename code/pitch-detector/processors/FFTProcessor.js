export class FFTProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = [];
        this.chunkSize = 6000;
        this.targetSize = 16384
    }

    process(inputs, outputs) {
        const input = inputs[0]; 
        const output = outputs[0]; 

        if (input.length > 0) {
            
            console.log("input", input, input[0].length);
            this.buffer.push(...input[0]); 

            if (this.buffer.length >= this.chunkSize) {
                // Process the accumulated chunk
                const chunk = this.buffer.slice(0, this.chunkSize);
                this.buffer = this.buffer.slice(this.chunkSize); // Remove processed chunk

                // Perform your operation on the chunk here
                // For simplicity, just copy it to the output
                output[0].set(chunk.slice(0, 128));
            } else {
                // If not enough data, just pass zeros
                output[0].fill(0);
            }
        }

        return true; // Keep processing
    }
}

registerProcessor('FFTprocessor', FFTProcessor);
