/**
 * Gestionnaire de sons proceduraux pour la physique
 */
export class PhysicsSoundManager {
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
	 * Joue un son de collision
	 */
	playCollision(velocity: number): void {
		if (!this.enabled) return;

		// Limiter la frequence des sons
		const now = performance.now();
		if (now - this.lastSoundTime < 50) return;
		this.lastSoundTime = now;

		// Creer le contexte audio si necessaire
		if (!this.audioContext) {
			this.audioContext = new AudioContext();
		}

		// Generer un son procedurale
		const oscillator = this.audioContext.createOscillator();
		const gainNode = this.audioContext.createGain();

		// Frequence basee sur la velocite
		oscillator.frequency.value = 100 + Math.min(velocity * 20, 300);
		oscillator.type = 'sine';

		// Volume base sur la velocite
		const volume = Math.min(velocity / 20, 0.3);
		gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

		oscillator.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		oscillator.start();
		oscillator.stop(this.audioContext.currentTime + 0.1);
	}

	/**
	 * Son de casse (bruit blanc)
	 */
	playBreak(): void {
		if (!this.enabled) return;

		if (!this.audioContext) {
			this.audioContext = new AudioContext();
		}

		// Bruit blanc pour la casse
		const bufferSize = this.audioContext.sampleRate * 0.15;
		const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
		const data = buffer.getChannelData(0);

		for (let i = 0; i < bufferSize; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
		}

		const noise = this.audioContext.createBufferSource();
		noise.buffer = buffer;

		const gainNode = this.audioContext.createGain();
		gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

		noise.connect(gainNode);
		gainNode.connect(this.audioContext.destination);

		noise.start();
	}

	dispose(): void {
		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}
	}
}
