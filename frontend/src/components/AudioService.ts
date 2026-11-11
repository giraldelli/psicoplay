/**
 * Serviço de áudio 100% silencioso e desativado.
 * Todos os métodos são no-op para garantir total silêncio no site.
 */
class AudioService {
  setSoundEnabled(_enabled: boolean) {}
  isSoundEnabled(): boolean {
    return false;
  }

  playPop(..._args: unknown[]) {}
  playSoftTap(..._args: unknown[]) {}
  playSuccessChime(..._args: unknown[]) {}
  playGentleError(..._args: unknown[]) {}
  playCalmTone(..._args: unknown[]) {}
  playChime(..._args: unknown[]) {}
  playSnap(..._args: unknown[]) {}
  playSuccessArpeggio(..._args: unknown[]) {}
}

export const audio = new AudioService();
