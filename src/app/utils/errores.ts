export function mensajeDeError(err: any): string {
  if (typeof err?.error === 'string' && err.error) return err.error;
  if (err?.error?.message) return err.error.message;
  if (err?.status === 403) return 'No tenés permiso para hacer esto';
  if (err?.status === 0) return 'No se pudo conectar con el servidor';
  return 'Ocurrió un error, intentá de nuevo';
}