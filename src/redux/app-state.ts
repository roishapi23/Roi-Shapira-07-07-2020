import { CurrentWeather } from "../models/locationCurrentWeather";


export class AppState {
    public favorites: CurrentWeather[] = [];
    public searchedCity : string = "Tel Aviv";
}