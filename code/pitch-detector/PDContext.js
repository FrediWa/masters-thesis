export class PDContext {
    microphoneStream;
    microphoneNode;
    audioContext;
    constructor() {
      this.audioContext = new AudioContext();
      
      this.SAMPLING_RATE = 44100;
      this.MAX_HPS_HARMONICS = 4;
      this.FFT_WINDOW = 16384;
      this.FFT_SAMPLES = 6000;
      this.CHANNELS = 1;
      
    }
}