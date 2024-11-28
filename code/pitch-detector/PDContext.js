export class PDContext {
    microphoneStream;
    microphoneNode;
    audioContext;
    constructor() {
      this.audioContext = new AudioContext();
    }
}