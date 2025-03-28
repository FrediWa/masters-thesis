
export class Recorder {

    static async startRecording(detector) {
        const stream = await navigator.mediaDevices.getUserMedia({audio: {
            channelCount: detector.audioContext.channelCount, 
            sampleRate: detector.audioContext.sampleRate,
        }})
        
        console.log(detector)
        console.log('AudioContext sample rate:', detector.audioContext.sampleRate);
        const audioTrack = stream.getAudioTracks()[0];
        const settings = audioTrack.getSettings();  
        console.log('Microphone stream sample rate:', settings.sampleRate); 

        detector.microphoneStream = stream;
        detector.microphoneNode = detector.audioContext.createMediaStreamSource(stream);
        console.log('Number of channels:', detector.microphoneNode.channelCount);
        console.log(detector.microphoneNode);
    }

    static stopRecording(detector) {
        detector.microphoneStream?.getTracks().forEach(track => track.stop());
        detector.microphoneNode?.disconnect();
    }
}
