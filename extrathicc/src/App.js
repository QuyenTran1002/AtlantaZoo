import React from "react";
import "./App.css";
import MenuIcon from "@material-ui/icons/Menu";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    withStyles
} from "@material-ui/core";
import {Link, Redirect} from "react-router-dom";
import Routes from "./Routes";
import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import UserContext from "./UserContext.js";
import LoginService from "./_services/LoginService.js";
import Button from "@material-ui/core/Button/Button";

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.setUserContext = (context) => {
            this.setState({userContext: {...this.state.userContext, ...context}});
        };

        this.state = {
            userContext: {email: null, username: null, userType: null, setUserContext: this.setUserContext, loggedIn: false, checkedLogin: false}
        };
    }

    componentDidMount() {
        LoginService.checkForExistingLogin()
                    .then(response => this.setState({userContext: {...this.state.userContext, email: response.email,
                                                                        loggedIn: true, username: response.username,
                                                                        userType: response.user_type, checkedLogin: true}}))
                    .catch(response => this.setState({userContext: {...this.state.userContext, email: null, loggedIn: false, checkedLogin: true }}));
    }

    handleHome = () => {
        const {loggedIn, userType} = this.state.userContext;
      if (loggedIn) {
          switch(userType.toLowerCase()) {
              case 'visitor':
                return '/visitorhome';
              case 'staff':
                  return '/staffhome';
              case 'admin':
                  return '/adminhome';
              default:
                  alert('Error');
          }
      }
      return '';
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            <Link to={this.handleHome()}>Menu</Link>
                        </Typography>
                        <Grid container direction="row" justify="space-around" alignItems="center">
                            <Link to="/registration">Registration</Link>
                            <Link to="/login">Login</Link>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <UserContext.Provider value={this.state.userContext}>
                    <Routes />
                </UserContext.Provider>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
