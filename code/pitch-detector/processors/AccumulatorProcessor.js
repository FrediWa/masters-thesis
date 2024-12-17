//---snippet-start-A
export class AccumulatorProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        const inputBuffer = input[0];
        this.port.postMessage(inputBuffer);
    }
}

registerProcessor('AccumulatorProcessor', AccumulatorProcessor);
//---snippet-end-A