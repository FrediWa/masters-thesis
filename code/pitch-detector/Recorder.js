
export class Recorder {

    static async startRecording(detector) {
        const stream = await navigator.mediaDevices.getUserMedia({audio: {
            channelCount: detector.CHANNELS, 
            sampleRate: detector.SAMPLING_RATE,
        }})

        detector.microphoneStream = stream;
        detector.microphoneNode = detector.audioContext.createMediaStreamSource(stream);
        console.log('Number of channels:', detector.microphoneNode.channelCount);
    }

    static stopRecording(detector) {
        detector.microphoneStream?.getTracks().forEach(track => track.stop());
        detector.microphoneNode?.disconnect();
    }
}
