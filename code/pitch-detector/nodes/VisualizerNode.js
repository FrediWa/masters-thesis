export class VisualizerNode extends AudioWorkletNode {

    constructor(audioContext) {
        super(audioContext, 'VizProcessor');
        this.insertionIndexOffset = 0;
        this.bufferLength = 16384;
        this.buffer = new Float32Array(this.bufferLength);

        this.port.onmessage = (event) => {
            if (event.data instanceof Array) {
                this.handlePortData(event.data);
            }
        };
    }
    
    handlePortData(data) {
        const dataLength = data.length;
        const overflow = this.bufferLength
        if (dataLength + this.insertionIndexOffset >= 16384) {
            this.visualize();
        }

        for(let i = 0; i < dataLength; i++) {
            this.buffer[this.insertionIndexOffset + i] = data[i];
        }

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

    visualize(dataArray) {
        if (this.suspended) 
            return; 

        const canvasWidth = this.canvasWidth;
        const canvasHeight = this.canvasHeight;

        console.log(dataArray, "shalom");
        // Clear canvas
        this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        // Set bar properties
        const barWidth = canvasWidth / dataArray.length;

        // Draw each value in the array as a bar
        dataArray.forEach((value, x) => {
            const barHeight = (value * canvasHeight/3) / 255; // Scale value to canvas height
            this.canvasContext.fillStyle = '#007bff'; // Bar color
            this.canvasContext.fillRect(x, canvasHeight - barHeight, barWidth, barHeight); // Draw bar
            x += barWidth + 1; // Move to the next bar position
        });
    }
}