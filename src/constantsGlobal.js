export const PERSONA_NATURAL = 451;
export const PERSONA_JURIDICA = 452;
export const FILE_OPTION_SOCIAL_STYLE_CONTACT = 1;
export const FILE_OPTION_REPORT_VISIT = 2;
export const FILE_OPTION_SHOPPING_MAP = 3;

let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://localhost:8084/Centricity";
}

export const APP_URL = API_URL;
