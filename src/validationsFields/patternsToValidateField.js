export const patternOfOnlyAlphabetical = /^[a-zA-Z\sÁ-Úá-úÑñÜü]+$/;
export const patternOfOnlyNumbers = "/[^0-9]/g";
export const patternOfNumberDocument = /^[a-zA-Z0-9\-Á-Úá-úÑñÜü]+$/;
export const patternOfPostalCode = "/[^a-zA-Z0-9\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfAddress = "/[^a-zA-Z0-9\\s\\-ÁÉÍÓÚáéíóúÑñ#();,.\"\/_´']/g";
export const patternOfNeighborhood = "/[^a-zA-Z0-9\\s\\-ÁÉÍÓÚáéíóúÑñÜü#();,.\"\/]/g";
export const patternOfObservation = /^[a-zA-Z0-9\s()\[\];,."!¡$%&\/¿?°#=':´+_\-Á-Úá-úÑñÜü]+$/;
export const patternOfPhone = "/[^0-9]/g";
export const patternOfContactRelevantFeatures = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfStructureEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const patternOfEmail = "/[^a-zA-Z0-9\\-ÁÉÍÓÚáéíóúÑñÜü@._&#]/g";
export const patternOfObservationLinkClient = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfOnlyNumbersLinkClient = "/[^0-9]/g";
export const patternOfHistory = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfHistoryEvent = "/[^a-zA-Z0-9\\s()\\\\;,.´'\"&\/°#':´+\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternOfClientName = /^[a-zA-Z0-9ñÑá-úÁ-Ú\s&/\\,;.#"°()'\-+´:]+$/;
export const patternOfDescription = /^[a-zA-Z0-9ñÑá-úÁ-Ú\s();,.\-"!$%&/¿?°#=¡':´+\[\]_]+$/;
export const patternOfClientAddress = /^[a-zA-Z0-9ñÑá-úÁ-Ú\s#();,.\-"/_´']+$/;
export const patternOfClientNeighborhood = /^[a-zA-Z0-9ñÑá-úÁ-Ú\s#();,.\-"/]+$/;
export const regexNumbers = /^[0-9]+$/;
export const patternOfForbiddenCharacter = /^[@+\-=].*$/;
export const patternOfOpportunityName = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternDecimalNumbers = /^[0-9.]+$/;
export const patternOfNameOtherParticipant = /^[a-zA-Z0-9\sÁ-Úá-úÑñÜü&/\\,;.#"]+$/;
export const patternOfPositionOtherParticipant = /^[a-zA-Z0-9\sÁ-Úá-úÑñÜü&/\\,;.#"]+$/;
export const patternOfCompanyOtherParticipant = /^[a-zA-Z0-9\sÁ-Úá-úÑñÜü&/\\,;.#"°()´'\-+:]+$/;
export const patternOfPlaceOfPrevisit = /^[a-zA-Z0-9\sÁ-Úá-úÑñÜü&/\\,;.#"]+$/;
export const patternOtherReason = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
export const patternNotesClient = "/[^a-zA-Z0-9\\s()\\[\\];,.\"!¡$%&\/¿?°#=':´+_\\-ÁÉÍÓÚáéíóúÑñÜü]/g";
