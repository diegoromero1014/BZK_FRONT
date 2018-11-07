export const patternOfOnlyAlphabetical = "/[^a-zA-Z\\sÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfOnlyNumbers = "/[^0-9]/g";
export const patternOfNumberDocument = "/[^a-zA-Z0-9\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfPostalCode = "/[^a-zA-Z0-9\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfAddress = "/[^a-zA-Z0-9\\s\\-#();,.\"\/]/g";
export const patternOfNeighborhood = "/[^a-zA-Z0-9\\s\\-ÁÉÍÓÚáéíóúÑñÜü#();,.\"\/]/g";
export const patternOfObservation = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfPhone = "/[^0-9\\s]/g";
export const patternOfContactRelevantFeatures = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const patternOfObservationLinkClient = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfOnlyNumbersLinkClient = "/[^0-9]/g";