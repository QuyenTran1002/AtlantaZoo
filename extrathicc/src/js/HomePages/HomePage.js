import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Grid} from "@material-ui/core";
import "../../css/Login.css";
import LoginService from "../../_services/LoginService";
import UserContext from "../../UserContext";

class HomePage extends Component {
    static contextType = UserContext;

    logout = event => {
        const {setUserContext} = this.context;
        LoginService.logout()
            .then(resp => setUserContext({loggedIn: false}))
            .catch(resp => resp.json().then(r => alert(r.message)));
    };
    render() {
        return (
            <div className="HomePage">
                <Grid container direction="row" justify="center">
                    <header id="title">Home Page</header>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid container direction="column" justify="space-evenly" alignItems="center">
                        <Link to="/exhibits">Exhibits</Link>
                        <Link to="/shows">Shows</Link>
                        <Link to="/animals">Animals</Link>
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <Grid container direction="column" justify="space-evenly" alignItems="center">
                        <Link to="/exhibit_history">Exhibit History</Link>
                        <Link to="/show_history">Show History</Link>
                        <Link to="/" onClick={this.logout}>Log out</Link>
                    </Grid>
                </Grid>
            </div>
        );
    };
}

export default HomePage;