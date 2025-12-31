/**
 * Gestionnaire de sons proceduraux
 */
export class SoundManager {
	private audioContext: AudioContext | null = null;
	private enabled = true;
	private lastSoundTime = 0;

	setEnabled(enabled: boolean): void {
		this.enabled = enabled;
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	/**
	 * Son de collision
	 */
	playCollision(velocity: number): void {
		if (!this.enabled) return;
		const now = performance.now();
		if (now - this.lastSoundTime < 50) return;
		this.lastSoundTime = now;

		if (!this.audioContext) this.audioContext = new AudioContext();

		const osc = this.audioContext.createOscillator();
		const gain = this.audioContext.createGain();
		osc.frequency.value = 100 + Math.min(velocity * 20, 300);
		osc.type = 'sine';
		gain.gain.setValueAtTime(Math.min(velocity / 20, 0.3), this.audioContext.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
		osc.connect(gain);
		gain.connect(this.audioContext.destination);
		osc.start();
		osc.stop(this.audioContext.currentTime + 0.1);
	}

	/**
	 * Son de casse (bruit blanc)
	 */
	playBreak(): void {
		if (!this.enabled) return;
		if (!this.audioContext) this.audioContext = new AudioContext();

		const bufferSize = this.audioContext.sampleRate * 0.15;
		const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
		}

		const noise = this.audioContext.createBufferSource();
		noise.buffer = buffer;
		const gain = this.audioContext.createGain();
		gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
		noise.connect(gain);
		gain.connect(this.audioContext.destination);
		noise.start();
	}

	dispose(): void {
		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}
	}
}
