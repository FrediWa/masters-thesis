export class FFTProcessorNode{
    node;

    async init(audioContext) {
        audioContext.audioWorklet.addModule('./processors/FFTProcessor.js').then(() => {
            this.node = new AudioWorkletNode(audioContext, 'FFTprocessor');
        })
    }
    connect(outputNode) {
        if (outputNode == null)
            return
        this.node.connect(outputNode);
    }

}