/**
 * Gemini Live API WebSocket Client
 * Connects to the Multimodal Live API for real-time video/audio streaming.
 */

const WS_URL = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent';

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private mediaStream: MediaStream | null = null;
  private onMessage: (msg: any) => void = () => {};
  private onStateChange: (state: 'connecting' | 'connected' | 'disconnected' | 'error') => void = () => {};
  
  // Audio playback queue
  private playbackQueue: Float32Array[] = [];
  private isPlaying = false;
  private nextPlayTime = 0;

  constructor(
    private apiKey: string,
    private systemInstruction: string
  ) {}

  public async connect() {
    this.onStateChange('connecting');
    const url = `${WS_URL}?key=${this.apiKey}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.onStateChange('connected');
      // Send Setup message
      this.ws?.send(JSON.stringify({
        setup: {
          model: "models/gemini-2.0-flash-exp",
          systemInstruction: {
            parts: [{ text: this.systemInstruction }]
          },
          generationConfig: {
            responseModalities: ["AUDIO"]
          }
        }
      }));
    };

    this.ws.onmessage = async (event) => {
      let data = event.data;
      if (data instanceof Blob) {
        data = await data.text();
      }
      const parsed = JSON.parse(data);
      this.handleServerMessage(parsed);
      this.onMessage(parsed);
    };

    this.ws.onclose = () => {
      this.onStateChange('disconnected');
      this.stopMedia();
    };

    this.ws.onerror = (e) => {
      console.error('Gemini Live WS Error:', e);
      this.onStateChange('error');
    };
  }

  public setCallbacks(onMessage: (msg: any) => void, onStateChange: (state: string) => void) {
    this.onMessage = onMessage;
    this.onStateChange = onStateChange;
  }

  private handleServerMessage(msg: any) {
    // Handle incoming audio
    if (msg.serverContent?.modelTurn?.parts) {
      for (const part of msg.serverContent.modelTurn.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
          this.playAudioChunk(part.inlineData.data);
        }
      }
    }
  }

  // --- Base64 / ArrayBuffer helpers ---
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // --- Audio Playback ---
  private async playAudioChunk(base64Data: string) {
    if (!this.audioContext) return;
    
    // Gemini returns PCM 16-bit 24kHz audio (usually). 
    // We decode it manually.
    const buffer = this.base64ToArrayBuffer(base64Data);
    const view = new DataView(buffer);
    const pcmData = new Float32Array(buffer.byteLength / 2);
    for (let i = 0; i < pcmData.length; i++) {
      pcmData[i] = view.getInt16(i * 2, true) / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(1, pcmData.length, 24000);
    audioBuffer.copyToChannel(pcmData, 0);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    if (this.nextPlayTime < this.audioContext.currentTime) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
  }

  // --- Capture & Send ---
  public async startMedia(videoElement: HTMLVideoElement) {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      videoElement.srcObject = this.mediaStream;
      
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Use ScriptProcessor for capturing audio (deprecated but easiest without external worker files)
      this.scriptNode = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.scriptNode.onaudioprocess = (e) => {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const channelData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to PCM16
        const pcm16 = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, channelData[i])) * 32767;
        }
        
        const base64 = this.arrayBufferToBase64(pcm16.buffer);
        this.ws.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64
            }]
          }
        }));
      };
      
      source.connect(this.scriptNode);
      this.scriptNode.connect(this.audioContext.destination);

    } catch (err) {
      console.error("Failed to start media:", err);
      this.onStateChange('error');
    }
  }

  public sendVideoFrame(base64Jpeg: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const base64Data = base64Jpeg.replace(/^data:image\/jpeg;base64,/, "");
    
    this.ws.send(JSON.stringify({
      realtimeInput: {
        mediaChunks: [{
          mimeType: "image/jpeg",
          data: base64Data
        }]
      }
    }));
  }

  public sendClientContent(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      clientContent: {
        turns: [{
          role: "user",
          parts: [{ text }]
        }],
        turnComplete: true
      }
    }));
  }

  public stopMedia() {
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.scriptNode?.disconnect();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
    }
  }

  public disconnect() {
    this.stopMedia();
    this.ws?.close();
  }
}
