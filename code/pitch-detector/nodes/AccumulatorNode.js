export class AccumulatorNode extends AudioWorkletNode{
    constructor(audioContext, callback) {
        super(audioContext, 'AccumulatorProcessor');
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