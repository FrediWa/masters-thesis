
export class Recorder {

    static async startRecording(detector) {
        // const stream = await navigator.mediaDevices.getUserMedia({audio: {
        //     channelCount: detector.audioContext.channelCount, 
        //     sampleRate: detector.audioContext.sampleRate,
        //     fauxField: 123,
        // }})
        
        // console.log(detector)
        // console.log('AudioContext sample rate:', detector.audioContext.sampleRate);
        // const audioTrack = stream.getAudioTracks()[0];
        // const settings = audioTrack.getSettings();  

        // detector.microphoneStream = stream;
        // detector.microphoneNode = detector.audioContext.createMediaStreamSource(stream);
        // console.log('Number of channels:', detector.microphoneNode.channelCount);
        // console.log(detector.microphoneNode);

        // // detector.microphoneNode.connect(detector.nodes.bridge); 
        // detector.microphoneNode.connect(detector.audioContext.destination);
        // const audioElement = new Audio();
        // audioElement.srcObject = stream;
        // audioElement.play();
    }

    static stopRecording(detector) {
        detector.microphoneStream?.getTracks().forEach(track => track.stop());
        detector.microphoneNode?.disconnect();
    }
}
