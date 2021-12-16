import { Component } from "react";
import { withTranslation } from "react-i18next";
import Login from '../login'
import RestShellApp from '../restshellApp'
import {isLoggedIn} from "../../backend/restshellbk";


var MySelf: RestShell;
class RestShell extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {loggedIn: false};
        MySelf=this;
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin() {
        if(isLoggedIn()) {
            MySelf.setState({loggedIn: true});
        } else {
            MySelf.setState({loggedIn: false});
        }        
    }

    render() {
        // const { t } = this.props;
        return (
            this.state.loggedIn ?
                <RestShellApp checkLogin={this.checkLogin}></RestShellApp>
                :
                <Login checkLogin={this.checkLogin}></Login>
        );
    }
}

export default withTranslation()(RestShell);



