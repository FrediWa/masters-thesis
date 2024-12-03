export class VisualizerNode extends AudioWorkletNode {

    constructor(audioContext) {
        super(audioContext, 'VizProcessor');
        this.insertionIndexOffset = 0;
        this.bufferLength = 16384;
        this.buffer = new Float32Array(this.bufferLength);

        this.port.onmessage = (event) => {
            if (event.data instanceof Float32Array) {
                console.log("What", event.data);
                this.handlePortData(event.data);
            }
        };
    }
    
    handlePortData(data) {
        const dataLength = data.length;
        if (dataLength + this.insertionIndexOffset >= 16384) {
            this.visualize();
            this.insertionIndexOffset %= 16384;
        }
        console.log(data, this.insertionIndexOffset)
        for(let i = 0; i < dataLength; i++) {
            this.buffer[this.insertionIndexOffset + i] = data[i];
        }
        console.log(this.buffer);

        this.insertionIndexOffset += dataLength;

    }

    setCanvas(canvas) {
        this.canvasContext = canvas.getContext("2d");
        this.canvasHeight = canvas.height
        this.canvasWidth = canvas.width
    }

    suspend() {
        this.suspended = true;    
    }

    resume() {
        this.suspended = false;
    }

    visualize() { 
        console.log("viz", this.buffer);
        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;

        // Clear canvas
        this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        // Set bar properties
        const barWidth = canvasWidth / 16284;
        let x = 0;
        // Draw each value in the array as a bar
        this.buffer.forEach((value) => {
            const barHeight = (1000 * value * canvasHeight/3) / 255; // Scale value to canvas height
            this.canvasContext.fillStyle = '#007bff'; // Bar color
            this.canvasContext.fillRect(x, canvasHeight, barWidth, barHeight); // Draw bar
            x += barWidth + 1; // Move to the next bar position
        });
    }
}