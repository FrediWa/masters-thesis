import { Recorder } from "./Recorder.js";
import { BridgeNode } from "./nodes/BridgeNode.js";
import { hps, postProcess, getNoteName, getSpectrum, spectralFlatness, isValidNote} from "./analysis.js"
import visualize from "./visualize.js";

const RENDER_QUANTUM_SIZE = 128;
const FFT_WINDOW_SIZE = 16384;
const SAMPLE_RATE = 44100;
const FFT_TARGET_SAMPLE_SIZE = 6000;
export class PitchDetector {

    constructor() {
      this.audioContext = new AudioContext({sampleRate: SAMPLE_RATE});
      this.nodes = {}
      this.recording = false;
      this.timer = 0;
      this.time = 0;
      this.noteGraph = null;
      this.tempoInterval = null;
      this.accumulatedNotes = [];
      this.currentDetectedNote = null;
      this.checkFlatness = true;
      this.checkOutliers = true;

      this.fftInputBuffer = new Float32Array(FFT_WINDOW_SIZE);
      this.fftBufferIteratorOffset = 0;

      this.setup();
    }

    async setupProcessors() {
      await this.audioContext.audioWorklet.addModule('./processors/BridgeProcessor.js');
    }
    
    async setupAudioGraph() {
      await this.setupProcessors();

      // Create all necessary nodes.
      this.nodes.elementSource = this.audioContext.createMediaElementSource(
        document.getElementById("media-element-source")
      );

      this.nodes.channelSplitter = this.audioContext.createChannelSplitter(2);

      //---snippet-start-A
      this.nodes.bridge = new BridgeNode(
        this.audioContext, 
        this.bridgeCallback.bind(this),
      );
      //---snippet-end-A
      
      // Connect neccessary nodes. The source node is created and connected in the play method.
      // this.nodes.elementSource.connect(this.audioContext.destination);
      this.nodes.channelSplitter.connect(this.audioContext.destination, 0);
      //---snippet-start-B
      this.nodes.channelSplitter.connect(this.nodes.bridge, 0);
      //---snippet-end-B
      // const oscillator = this.audioContext.createOscillator();

      // oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime); // value in hertz
      // oscillator.connect(this.audioContext.destination);
      // oscillator.connect(this.nodes.bridge);
      // oscillator.start();
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
      this.recording = true;
      
      const BPM = 120;
      this.tempoInterval = setInterval(() => {
        console.log("Beat")
        this.accumulatedNotes.push(this.currentDetectedNote);
      }, 30000/BPM);
      
      await this.audioContext.resume();
      this.fftBufferIteratorOffset = 0;

      this.nodes.elementSource.connect(this.nodes.channelSplitter);

      const mediaElement = document.getElementById("media-element-source");
      mediaElement.currentTime = 0;
      mediaElement.play();
      mediaElement.loop = true;
    }
    
    stop() {
      if (!this.recording)
        return;
      this.recording = false;
      
      
      if (this.tempoInterval != null)
        clearInterval(this.tempoInterval);

      this.audioContext.suspend();
      this.currentDetectedNote = null;

      Recorder.stopRecording(this);
      console.log(this.accumulatedNotes);
      this.accumulatedNotes = [];
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
        
        // Run the fourier transform and compute spectrum data.
        const spectrum = getSpectrum(this.fftInputBuffer, FFT_WINDOW_SIZE);

        // console.log("Time taken for accumulation, zeropad and FFT:", performance.now()-this.timer, "ms");
        this.timer = 0;

        visualize("fftCanvas", spectrum, [40, 2000], SAMPLE_RATE/FFT_WINDOW_SIZE);
        // This is mostly for debugging.
        let largest = 0;
        let largestIndex = 0;
        const binSize = this.audioContext.sampleRate / FFT_WINDOW_SIZE;

        for (let i = 0; i < spectrum.length; i++) {
            if (spectrum[i] > largest) {   
                largest = spectrum[i];
                largestIndex = i;
            }
        }
        // console.log("FFT largest", largestIndex, largestIndex*binSize); 
        // Until like here.
        const flatness = spectralFlatness(spectrum);
        document.querySelector("#spectral-flatness").innerHTML = flatness;
        
        const peak = hps(spectrum, 5);
        visualize("hpsCanvas",  peak, [40, 300], SAMPLE_RATE/FFT_WINDOW_SIZE);
        
        const [midiNumber, frequency] = postProcess(peak, binSize);

        // Update note only if not flat to avoid garbage from HPS.
        if (flatness < 0.6 || !this.checkFlatness) {
        }

        const flatnessCriteria = flatness < 0.6;

        if (isValidNote(this.checkFlatness, flatnessCriteria, this.checkOutliers, midiNumber)) {
          this.currentDetectedNote = midiNumber
        }


        // console.log(midiNumber, frequency);
        const noteName = getNoteName(this.currentDetectedNote);
        document.getElementById("note-name").innerHTML = noteName;
        document.getElementById("midi-number").innerHTML = this.currentDetectedNote;

        this.fftBufferIteratorOffset = 0;
    }
  }

    //---snippet-start-C
    bridgeCallback(data) {
      this.analyze(data);
    }
    //---snippet-end-C
}

const detector = new PitchDetector();

