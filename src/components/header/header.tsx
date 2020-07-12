import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./header.css"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class Header extends Component<any>{

  public constructor(props:any){
    super(props)
  }
  navToFavorites = () => {
    this.props.history.push('/Favorites')
  }
  navToMain = () => {
    this.props.history.push('/Home')
  }
   
  public render(){
    return(
      <div className="header" >
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand >Herolo weather task</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link href="" onClick={this.navToMain}>Main</Nav.Link>
              <Nav.Link href="" onClick={this.navToFavorites}>Favorites</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

export default withRouter (Header);