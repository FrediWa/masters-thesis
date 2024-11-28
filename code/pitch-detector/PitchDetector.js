import { Recorder } from "./Recorder.js";
import { PDContext } from "./PDContext.js";
import { FFTProcessorNode } from "./nodes/FFTProcessorNode.js";

export class PitchDetector {

    constructor() {
      this.SAMPLING_RATE = 44100;
      this.MAX_HPS_HARMONICS = 4;
      this.FFT_WINDOW = 16384;
      this.FFT_SAMPLES = 6000;

      this.recording = false;

      this.setupDOM();
      this.setupaAudioGraph();
      
    }

    setupDOM() {
      document.querySelector("#pd-start-btn").addEventListener("click", this.start.bind(this));
      document.querySelector("#pd-stop-btn").addEventListener("click", this.stop.bind(this));
    }

    setupaAudioGraph() {
      this.pdContext = new PDContext();

      this.fftNode = new FFTProcessorNode();
      this.fftNode.init(this.pdContext.audioContext);
    }
    
    async start() {
      if (this.recording)
        return;
      this.recording = true
      
      await Recorder.startRecording(this.pdContext);

      this.pdContext.microphoneNode.connect(this.pdContext.audioContext.destination);
      this.pdContext.microphoneNode.connect(this.fftNode.node);  
    }

    stop() {
      if (!this.recording)
        return;
      this.recording = false;

      Recorder.stopRecording(this.pdContext);
    }
}

const detector = new PitchDetector();
