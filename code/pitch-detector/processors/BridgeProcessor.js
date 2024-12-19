//---snippet-start-A
export class BridgeProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        const inputBuffer = input[0];
        this.port.postMessage(inputBuffer);
    }
}

registerProcessor('BridgeProcessor', BridgeProcessor);
//---snippet-end-A