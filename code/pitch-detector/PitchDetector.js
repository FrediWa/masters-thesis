import { Recorder } from "./Recorder.js";
import { PDContext } from "./PDContext.js";
import { AccumulatorNode } from "./nodes/AccumulatorNode.js";
import { FFTJS } from "./fftjs.js"
import { zeroPad, fft, hps, postProcess, getNodeName } from "./analysis.js"

const RENDER_QUANTUM_SIZE = 128;
const FFT_WINDOW_SIZE = 16384;
const FFT_TARGET_SAMPLE_SIZE = 6000;
export class PitchDetector {

    constructor() {
      this.audioContext = new AudioContext();
      this.nodes = {}
      this.recording = false;
      
      this.fftInputBuffer = new Float32Array(FFT_WINDOW_SIZE);
      this.fftBufferIteratorOffset = 0;
      this.FFTJS = new FFTJS(FFT_WINDOW_SIZE);

      this.setup();
    }

    async setupProcessors() {
      await this.audioContext.audioWorklet.addModule('./processors/AccumulatorProcessor.js');
    }
    
    async setupAudioGraph() {
      await this.setupProcessors();

      
      this.nodes.elementSource = this.audioContext.createMediaElementSource(
        document.getElementById("media-element-source")
      );

      this.nodes.accumulator = new AccumulatorNode(
        this.audioContext, 
        this.fftCallback.bind(this),
      );

    }
    
    setupDOM() {
        document.querySelector("#pd-start-btn").addEventListener("click", this.start.bind(this));
        document.querySelector("#pd-stop-btn").addEventListener("click", this.stop.bind(this));
    }
      
    async setup() {
      await this.setupAudioGraph();
      this.setupDOM();
    }

    async start() {
      if (this.recording)
        return;
      this.recording = true
      
      await this.audioContext.resume();
      this.fftBufferIteratorOffset = 0;

      this.nodes.elementSource.connect(this.audioContext.destination);
      this.nodes.elementSource.connect(this.nodes.accumulator); 

      const mediaElement = document.getElementById("media-element-source");
      mediaElement.currentTime = 0;
      mediaElement.play();
      mediaElement.loop = true;
    }
    
    

    stop() {
      if (!this.recording)
        return;
      this.recording = false;

      this.audioContext.suspend();

      Recorder.stopRecording(this);
    }

    fftCallback(data) {
      console.log("callback");
      for (let i = 0; i < RENDER_QUANTUM_SIZE; i++) {
        this.fftInputBuffer[i + this.fftBufferIteratorOffset] = data[i];
      }

      this.fftBufferIteratorOffset += RENDER_QUANTUM_SIZE;
      
      // Perform all the analysis once enough samples.
      if (this.fftBufferIteratorOffset >= FFT_TARGET_SAMPLE_SIZE) {
        console.log("perform analysis");
        const transform = fft(this.fftInputBuffer);
        const hps = hps(transform);
        const midiNumber = postProcess(hps);
        const noteName = getNoteName(midiNumber);
      }
  
    }
}

const detector = new PitchDetector();

