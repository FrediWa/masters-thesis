export class FFTProcessorNode extends AudioWorkletNode{
    constructor(audioContext) {
        super(audioContext, 'FFTprocessor');
    }
}