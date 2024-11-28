export class VisualizerNode {
    constructor(audioContext, canvas) {
        this.canvasContext = canvas.getContext("2d");
        this.canvasHeight = canvas.height
        this.canvasWidth = canvas.width
        this.analyser = audioContext.createAnalyser();
    }
    initAndConnect(audioContext, outputNode) {
        if (outputNode != null)
            this.analyser.connect(outputNode);
    }
    visualize(dataArray) {
        // Clear canvas
        this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        // Set bar properties
        const barWidth = canvasWidth / dataArray.length;

        analyser.getByteTimeDomainData(dataArray);

        // Draw each value in the array as a bar
        dataArray.forEach((value, x) => {
            const barHeight = (value * canvasHeight/3) / 255; // Scale value to canvas height
            this.canvasContext.fillStyle = '#007bff'; // Bar color
            this.canvasContext.fillRect(x, canvasHeight - barHeight, barWidth, barHeight); // Draw bar
            x += barWidth + 1; // Move to the next bar position
        });
    }
}