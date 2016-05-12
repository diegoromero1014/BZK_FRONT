export const PERSONA_NATURAL = 451;
export const PERSONA_JURIDICA = 452;
let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://192.168.2.45:8087/Centricity";
}

export const APP_URL = API_URL;
