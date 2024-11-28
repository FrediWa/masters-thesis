
export class Recorder {

    static async startRecording(pdContext) {
        const stream = await navigator.mediaDevices.getUserMedia({audio: {
            channelCount: 2, 
        }})

        pdContext.microphoneStream = stream;
        pdContext.microphoneNode = pdContext.audioContext.createMediaStreamSource(stream);
        console.log('Number of channels:', pdContext.microphoneNode.channelCount);
    }

    static stopRecording(pdContext) {
      pdContext.microphoneNode?.disconnect();
      pdContext.microphoneStream?.getTracks().forEach(track => track.stop());
    }
}
