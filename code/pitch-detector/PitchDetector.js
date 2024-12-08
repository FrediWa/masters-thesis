import { Recorder } from "./Recorder.js";
import { AccumulatorNode } from "./nodes/AccumulatorNode.js";
import { FFTJS } from "./fftjs.js"
import { hps, postProcess, getNoteName } from "./analysis.js"
import visualize from "./visualize.js";

const RENDER_QUANTUM_SIZE = 128;
const FFT_WINDOW_SIZE = 16384;
const FFT_TARGET_SAMPLE_SIZE = 6000;
export class PitchDetector {

    constructor() {
      this.audioContext = new AudioContext();
      this.nodes = {}
      this.recording = false;
      this.timer = 0;
      this.time = 0;
      this.noteGraph = null;

      this.FFT = new FFTJS(FFT_WINDOW_SIZE);
      this.fftInputBuffer = new Float32Array(FFT_WINDOW_SIZE);
      this.fftBufferIteratorOffset = 0;

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
        this.accumulatorCallback.bind(this),
      );
    }
    
    setupDOM() {
        document.querySelector("#pd-start-btn").addEventListener("click", this.start.bind(this));
        document.querySelector("#pd-stop-btn").addEventListener("click", this.stop.bind(this));
        this.noteGraphCtx = document.querySelector("#note-graph").getContext("2d");
        this.noteGraphCtx.clearRect(0, 0, canvas.width, canvas.height);
        
    }
      
    async setup() {
      await this.setupAudioGraph();
      this.setupDOM();
    }

    async start() {
      if (this.recording)
        return;
      this.recording = true;
      
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

    analyze(data) {
      if(this.timer == 0) 
        this.timer = performance.now();
      // Copy buffer chunk to fft input vector.
      for (let i = 0; i < RENDER_QUANTUM_SIZE; i++) {
        this.fftInputBuffer[i + this.fftBufferIteratorOffset] = data[i];
      }
      this.fftBufferIteratorOffset += RENDER_QUANTUM_SIZE;
      
      // Perform all the analysis once enough samples.
      if (this.fftBufferIteratorOffset >= FFT_TARGET_SAMPLE_SIZE) {
        console.log("perform analysis");

        const square = (x) => x*x;

        // Run the fourier transform and compute spectrum data.
        const transform  = this.FFT.createComplexArray();
        this.FFT.realTransform(transform, this.fftInputBuffer);
        const spectrum = new Float32Array(16384);
        for (let i = 0; i < 16384; i++) {
          spectrum[i] = Math.sqrt(square(transform[i])+square(transform[i+1]))
        }

        console.log("Time taken for accumulation, zeropad and FFT:", performance.now()-this.time, "ms");
        this.timer = 0;

        visualize("fftCanvas", spectrum, [40, 2000]);

        const peak = hps(spectrum, 4);
        visualize("hpsCanvas",  peak, [40, 2000]);

        const binSize = this.audioContext.sampleRate / FFT_WINDOW_SIZE;
        const [midiNumber, frequency] = postProcess(peak, binSize);
        console.log(midiNumber, frequency);
        const noteName = getNoteName(midiNumber);
        document.getElementById("note-name").innerHTML = noteName;

        this.fftBufferIteratorOffset = 0;
    }
  }

    accumulatorCallback(data) {
      console.log("callback");
      this.analyze(data);
    }
}

const detector = new PitchDetector();

