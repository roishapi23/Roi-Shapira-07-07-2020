export class CurrentWeather{
    constructor(
       public IsDayTime?:boolean,
       public LocalObservationDateTime?:string,
       public Temperature?:any,
       public WeatherIcon?:number,
       public WeatherText?:string,
       public Key?:string,
       public LocalizedName?:string
    ){}
}