
export function useTranslation(ns?: string, options?: any){
  return {
    ready: true,
    t: (key: string) => key,
    i18n: null
  }
}