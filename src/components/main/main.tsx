import React, { Component, ChangeEvent } from "react";
import "./main.css"
import axios from "axios";
import { CurrentWeather } from "../../models/locationCurrentWeather";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-Type";
import { FiveDaysForecast } from "../../models/locationForecast";
import { Button,Modal } from 'react-bootstrap'

interface mainState{
   currentCityDetails: CurrentWeather
   searchInput:string,
   fiveDaysForecast:FiveDaysForecast[]
   isFavorite:boolean
   showHide:boolean
   errorMessage:string
}

export default class Main extends Component<any,mainState>{
   
   private myApiKey = "ZhxZznP0u5c0PILjfeFyq4EjBuBdw5jx";
   private locationEndPoint = "http://dataservice.accuweather.com/locations/v1/cities/autocomplete";
   private currentWeatherEndPoint = "http://dataservice.accuweather.com/currentconditions/v1/"
   private fiveDaysEndPoint = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"

   public constructor(props:any){
      super(props)
      this.state = {
         currentCityDetails:null,
         searchInput:"",
         fiveDaysForecast:[],
         isFavorite:false,
         showHide : false,
         errorMessage:""
      }
   }
   componentDidMount = async () =>{
      await this.getDataFromApi();
   }

   getDataFromApi = async () => {
      try {
         let currentCity = await this.getCityKey()
         this.isCityFavorite(currentCity.Key)
         await this.getCityCurrentWeather(currentCity)
         await this.getCity5DaysWeather(currentCity)
         
      } catch (error) {
         /* do nothing beacuse each request has an error
         function that display the modal in it's catch */
      }
   }

   getCityKey = async () => { /* first end point request */
      let cityName = store.getState().searchedCity;
      try {
         let locationQuery = `?apikey=${this.myApiKey}&q=${cityName}`;
         let locationResponse = await axios.get<any[]>(this.locationEndPoint+locationQuery)
         if (locationResponse.data.length == 0) { /* means that no city was found */
            this.setState({errorMessage:"We couldn't get what you looking for"})
            throw new Error();
         }
         else{
            let currentCity = locationResponse.data[0];
            return currentCity;
         }

      } catch (error) {
         this.handleModalShowHide();
      }
   }

   isCityFavorite = (searchedCityKey:string) => { /* check if city is already in favorites */
      let currentFavorites = store.getState().favorites
      for (let index = 0; index < currentFavorites.length; index++) {
         if(currentFavorites[index].Key == searchedCityKey){
            this.setState({isFavorite:true})
            return;
         }
      }
      this.setState({isFavorite:false})
   }

   getCityCurrentWeather = async (currentCity:CurrentWeather) => { /* second end point request */
      try {
         let weatherQuery = `${currentCity.Key}?apikey=${this.myApiKey}&metric=true`
         let weatherResponse = await axios.get<CurrentWeather[]>(this.currentWeatherEndPoint+weatherQuery)
         let currentWeather = weatherResponse.data[0];
         currentWeather["Key"] = currentCity.Key;
         currentWeather["LocalizedName"] = currentCity.LocalizedName;
         this.setState({currentCityDetails:currentWeather})
         
      } catch (error) {
         this.setState({errorMessage:"Faild to get currnet weather, Please check your internet connection"})
         this.handleModalShowHide();
      }
   }

   getCity5DaysWeather = async (currentCity:CurrentWeather) => { /* third end point request */
      try {
         let weatherQuery = `${currentCity.Key}?apikey=${this.myApiKey}&metric=true`
         let fiveDaysResponse = await axios.get<FiveDaysForecast>(this.fiveDaysEndPoint+weatherQuery)
         let fiveDaysWeather = fiveDaysResponse.data.DailyForecasts;
         this.setState({fiveDaysForecast:fiveDaysWeather})
      } catch (error) {
         this.setState({errorMessage:"Faild to get 5 days forecast, Please check your internet connection"})
         this.handleModalShowHide();
      }
   }

   addToFavorites = (city:CurrentWeather) =>{
      store.dispatch({ type: ActionType.UpdateFavorites, payload: city});
      this.setState({isFavorite:true})
   }

   removeFromFavorites = (cityKey:string) =>{
      let currentFavorites = store.getState().favorites
      for (let index = 0; index < currentFavorites.length; index++) {
         if(currentFavorites[index].Key == cityKey){
            currentFavorites.splice(index,1)
            store.dispatch({ type: ActionType.RemoveFavorite, payload: currentFavorites });
            this.setState({isFavorite:false})
         }
      }
   }
   setSearch = (args: ChangeEvent<HTMLInputElement>) => { /* data binding */
      let searchInput = args.target.value   
      this.setState({searchInput:searchInput})
   }
   getDay = (dateString:string) => { /* return which day is it - by Date */
      let d = new Date(dateString);
      let dayName = d.toString().split(' ')[0];
      return dayName;
   }
   searchNewCity = async () => { /* send new search */
      if (this.state.searchInput == "") { /* empty input validation */
         this.setState({errorMessage:"Please write a city name"})
         this.setState({ showHide: !this.state.showHide })
         return;
      }
      store.dispatch({ type: ActionType.SetUserSearch, payload: this.state.searchInput});
      await this.getDataFromApi();
   }


   handleModalShowHide() { /* modal display switch hide/show */
      this.setState({ showHide: !this.state.showHide })
   }

   public render(){
      return(
        <div className="main" >
           <div id="searchArea" >
              <div id="searchInput">
               <input type="text" placeholder="City" name="city"
               value={this.state.searchInput} onChange={this.setSearch} className="form-control form-control-sm" />
              </div>
              <div id="searchButton">
               <button type="button" className="btn btn-primary btn-sm"  onClick={this.searchNewCity}> <img src="https://www.iconsdb.com/icons/preview/white/search-3-xxl.png" width="15" alt=""/> Search</button><br />

              </div>
           </div>
            <div className="container">
               <div className="currentCityDiv" >
                  {
                     this.state.currentCityDetails === null ||
                     <React.Fragment>
                        <div className="topLeftArea">
                           <div id="currentWeatherIcon">
                              <img src={require(`../../assets/icons/${this.state.currentCityDetails.WeatherIcon}.png`)} width="100" />
                           </div>                 
                           <div className="nameAndTemp">      
                              <h5><b>{this.state.currentCityDetails.LocalizedName}</b></h5>
                              <h6><b>{this.state.currentCityDetails.Temperature.Metric.Value} °C</b></h6>
                           </div>  
                        </div>
                        <div className="favoritesButtons">
                           <button type="button" className="btn btn-danger" hidden={this.state.isFavorite}
                           onClick={() => this.addToFavorites(this.state.currentCityDetails)}> <img src="https://image.flaticon.com/icons/svg/130/130198.svg" width="30" alt=""/></button>
                           <button type="button" className="btn btn-danger" hidden={!this.state.isFavorite} onClick={() => this.removeFromFavorites(this.state.currentCityDetails.Key)} > <img src="https://image.flaticon.com/icons/svg/130/130197.svg" width="30"/></button>
                        </div>
                        <div className="weatherText">
                           <h3>Today</h3>
                           <h1><b>{this.state.currentCityDetails.WeatherText}</b></h1>
                        </div>
                        <div className="card-deck">
                           {this.state.fiveDaysForecast.map((singleDay) =>                          
                              <div key={singleDay.Date} className="card">
                                 <div className="card-body">
                                    <h3>{this.getDay(singleDay.Date)}</h3>
                                    <h5 className="card-title">{singleDay.Day.IconPhrase}</h5>
                                    <img src={require(`../../assets/icons/${singleDay.Day.Icon}.png`)} />
                                 </div>
                                 <div className="card-footer">
                                    <small className="text-muted">{singleDay.Temperature.Maximum.Value} °C</small>
                                 </div>
                              </div>
                           )}
                        </div>
                     </React.Fragment>
                  }
               </div>
            </div>
            <Modal className="myModal" show={this.state.showHide}>
               <div className="modalWrapper">
                  <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                     <Modal.Title className="modalHeader">
                        <h4>Opsss..</h4>
                     </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <h4>{this.state.errorMessage}</h4>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                        Close
                     </Button>
                  </Modal.Footer>
               </div>
            </Modal>
            
         </div>

      )
   }
}