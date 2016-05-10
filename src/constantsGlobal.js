let API_URL;
if (process.env.NODE_ENV === "production") {
    API_URL = "https://serviciosdllopseries.bancolombia.corp/Biztrack";
} else {
    API_URL = "http://192.168.2.67:8087/Centricity";
}

export const APP_URL = API_URL;
