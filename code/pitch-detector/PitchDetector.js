import { Recorder } from "./Recorder.js";
import { PDContext } from "./PDContext.js";
import { FFTProcessorNode } from "./nodes/FFTProcessorNode.js";
import { VisualizerNode } from "./nodes/VisualizerNode.js";

export class PitchDetector {

    constructor() {
      this.pdContext = new PDContext();
      this.nodes = {}

      this.recording = false;
      this.ready = false;
      this.setup();
    }

    
    async setupProcessors() {
      await this.pdContext.audioContext.audioWorklet.addModule('./processors/FFTProcessor.js');
      await this.pdContext.audioContext.audioWorklet.addModule('./processors/VizProcessor.js');
    }
    
    async setupAudioGraph() {
      await this.setupProcessors();

      this.nodes.fftNode            = new FFTProcessorNode(this.pdContext.audioContext);
      this.nodes.waveformVisualizer = new VisualizerNode(this.pdContext.audioContext);
      this.nodes.spectrumVisualizer = new VisualizerNode(this.pdContext.audioContext);
      this.nodes.peakVisualizer     = new VisualizerNode(this.pdContext.audioContext);
      
      this.nodes.fftNode.connect(this.nodes.spectrumVisualizer);
    }
    
    setupDOM() {
        document.querySelector("#pd-start-btn").addEventListener("click", this.start.bind(this));
        document.querySelector("#pd-stop-btn").addEventListener("click", this.stop.bind(this));
        
        this.nodes.waveformVisualizer.setCanvas(document.querySelector("#waveCanvas"));
        this.nodes.spectrumVisualizer.setCanvas(document.querySelector("#fftCanvas"));
        // this.nodes.peakVisualizer.setCanvas(document.querySelector("#hpsCanvas"));
    }
      
    async setup() {
      await this.setupAudioGraph();
      this.setupDOM();

      this.ready = true;
    }

    async start() {
      if (this.recording)
        return;
      this.recording = true

      this.pdContext.audioContext.resume();
      
      await Recorder.startRecording(this.pdContext);

      this.pdContext.microphoneNode.connect(this.pdContext.audioContext.destination);
      this.pdContext.microphoneNode.connect(this.nodes.fftNode); 

      // this.pdContext.microphoneNode.connect(this.nodes.waveformVisualizer);  
    }

   stop() {
      if (!this.recording)
        return;
      this.recording = false;

      this.pdContext.audioContext.suspend();

      Recorder.stopRecording(this.pdContext);
    }
}

const detector = new PitchDetector();

