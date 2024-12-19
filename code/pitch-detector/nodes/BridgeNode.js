//---snippet-start-A
export class BridgeNode extends AudioWorkletNode{
    constructor(audioContext, callback) {
        super(audioContext, 'BridgeProcessor');
        this.callback = callback;

        this.port.onmessage = (event) => {
            if (event.data instanceof Float32Array) {
                this.handlePortData(event.data);
            }
        };
    }

    handlePortData(data) {
        this.callback(data);
    }
}
//---snippet-end-A
