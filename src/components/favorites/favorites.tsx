import React, { Component } from "react";
import "./favorites.css"
import { store } from "../../redux/store";
import { CurrentWeather } from "../../models/locationCurrentWeather";
import { ActionType } from "../../redux/action-Type";
// import { Unsubscribe } from "redux";

interface favoritesState{
    favorites: CurrentWeather[]
}

export default class Favorites extends Component<any,favoritesState>{

    public constructor(props:any){
       super(props)
        this.state = {
           favorites:[]
        }
    }
    componentDidMount = () =>{ /* get current favorites */
        let favoritesCities = store.getState().favorites
        this.setState({favorites:favoritesCities})      
    }
    onCityClicked = (city:CurrentWeather) =>{ /* nav to main with this city details */
        store.dispatch({ type: ActionType.SetUserSearch, payload: city.LocalizedName});
        this.props.history.push('/Home')
    }

    public render(){
        return(
            <div className="favoritesComponent" >
            
                <div className="card-deck" id="favoritesArea">
                    {this.state.favorites.map((singleFavorite) =>
                        <div key={singleFavorite.Key} className="card" id="singleFavorite" onClick={() => this.onCityClicked(singleFavorite)}>
                            <div className="card-body">
                                <h3 className="card-title">{singleFavorite.LocalizedName}</h3>
                                <span className="card-text">
                                    <h4>{singleFavorite.WeatherText}</h4>
                                    <img src={require(`../../assets/icons/${singleFavorite.WeatherIcon}.png`)} width="70" />
                                </span>
                            </div>
                            <div className="card-footer">
                                <big className="text-muted"> {singleFavorite.Temperature.Metric.Value} °C </big>
                            </div>
                        </div>
                    )}
                </div>
           
            </div>
        )
    }
}