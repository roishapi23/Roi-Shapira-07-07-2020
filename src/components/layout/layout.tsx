import React, { Component } from "react";
import "./layout.css"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "../header/header";
import Favorites from "../favorites/favorites";
import Main from "../main/main";

export default class Layout extends Component{

    public render(){
        return(
            <BrowserRouter>
                <section className="layout">
                    <header>
                        <Header/>
                    </header>
                    <main>
                        <Switch>
                            <Route path="/Home" component={Main} exact></Route>
                            <Route path="/Favorites" component={Favorites} exact></Route>
                            <Redirect from="/" to="/Home" exact ></Redirect>
                        </Switch>
                    </main>
                    
                </section>
            
            </BrowserRouter>
        )
    }
}