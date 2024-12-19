

export default function visualize(canvasID, data, range=[0, 16384]) {
    console.log("viz");
    // Get the canvas element and its context
    const canvas = document.getElementById(canvasID);
    if (!canvas) {
        console.error(`Canvas with ID "${canvasID}" not found.`);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error(`Unable to get 2D context for canvas "${canvasID}".`);
        return;
    }

    const dataRange = data.slice(range[0], range[1]);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scaling factors
    const width = canvas.width;
    const height = canvas.height;
    const maxValue = Math.max(...dataRange);
    const minValue = Math.min(...dataRange);

    const xStep = width / dataRange.length;
    const yScale = maxValue !== minValue ? height / (maxValue - minValue) : 1;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;

    // Draw the data points
    ctx.beginPath();
    ctx.moveTo(0, height - (dataRange[0] - minValue) * yScale); // Start at the first data point
    for (let i = 0; i < dataRange.length; i++) {
        const x = i * xStep;
        const y = height - (dataRange[i] - minValue) * yScale;
        ctx.lineTo(x, y);
    }

    ctx.stroke();
}
