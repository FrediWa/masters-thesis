

export default function visualize(canvasID, data, range=[0, 16384], binSize) {
    
    const numberOfBins = Math.floor((range[1] - range[0]) / binSize);
    const startingFrequency = range[0];
    
    const indexOffset = Math.ceil(range[0]/binSize);
    const dataInRange = data.slice(indexOffset, indexOffset+numberOfBins);
    // console.log(indexOffset, numberOfBins, dataInRange);
    
    // Define ticks and filter out those not in range.
    let ticks = [10, 155, 220, 330, 440, 550, 660, 770, 4000];
    ticks = ticks.filter((frequency) => frequency > range[0] && frequency < range[1]);


    // const result = words.filter((word) => word.length > 6);

    let maxValue = Math.max(...dataInRange);
    if (isNaN(maxValue))
        maxValue = 1;

    // console.log("viz", data, binSize, range, numberOfBins, startingFrequency, maxValue);
    
    
    
    // Get the canvas element and its context
    const canvas = document.getElementById(canvasID);
    if (!canvas) {
        console.error(`Canvas with ID "${canvasID}" not found.`);
        return;
    }

    // Calculate scaling factors
    const width = canvas.width;
    const height = canvas.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error(`Unable to get 2D context for canvas "${canvasID}".`);
        return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    const xStep = canvas.width / numberOfBins;
    
    // Draw ticks
    // ticks.forEach((tick) => {
    //     ctx.fillRect((tick-range[0])/2.7 * xStep, 0, 1, canvas.height);
    // });

    for (let i = 0; i < numberOfBins; i++) {
        const index = (i+indexOffset);
        // console.log("bin", index, ":", data[index]);
        const x = i * xStep;

        ctx.fillRect(x, canvas.height, xStep, -dataInRange[i] / maxValue * canvas.height * 0.9);
    }


    // const dataRange = data.slice(range[0], range[1]);


    
    
    // const xStep = width / dataRange.length;
    // ctx.fillRect(500 * xStep, 0, 1, canvas.height);
    // console.log("viz", dataRange.length);
    // const yScale = maxValue !== minValue ? height / (maxValue - minValue) : 1;


    // const ticks = [110, 220, 330, 440, 550, 660, 770];

    // // Draw the data points
    // ctx.beginPath();
    // ctx.moveTo(0, height - (dataRange[0] - minValue) * yScale); // Start at the first data point
    // for (let i = 0; i < dataRange.length; i++) {
    //     const currentFrequency = (range[0] + i )* binSize;
    //     console.log("freq", currentFrequency)
    // }

    // ctx.stroke();
}
