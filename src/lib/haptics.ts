/**
 * Módulo de Utilidad Háptica Segura ("fail-safe")
 * Permite emitir vibraciones físicas en dispositivos móviles compatibles,
 * fallando de manera silenciosa y segura en entornos no compatibles o SSR.
 */

export function triggerVibration(pattern: number | number[]): boolean {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch (error) {
      // Retorna silenciosamente si ocurre algún error inesperado
      return false;
    }
  }
  return false;
}

/**
 * Patrón corto para pulsaciones o micro-interacciones táctiles.
 */
export function hapticTap(): void {
  triggerVibration([50]);
}

/**
 * Patrón de celebración para hitos conseguidos, hidratación o éxito en tareas.
 */
export function hapticSuccess(): void {
  triggerVibration([100, 50, 100]);
}

/**
 * Patrón de alerta o advertencia para fin de tiempos de descanso o errores.
 */
export function hapticWarning(): void {
  triggerVibration([50, 50, 50]);
}
