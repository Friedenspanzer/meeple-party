export const fallbackLng = "en";
export const languages = [fallbackLng, "de"];
export const defaultNS = "default";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
