import { Component } from "react";
import { withTranslation } from "react-i18next";
import { doLogin } from "../../backend/restshellbk";
import { Alert } from "react-bootstrap";

var MySelf: Login;

class Login extends Component<any, any> {

  constructor(props: any) {
    super(props);
    MySelf = this;
    this.state = {showError:false}
  }

  async doLogin(e: any) {
    MySelf.setState({showError:false});
    e.preventDefault();
    var loginRes = await doLogin(e.target.username.value, e.target.password.value);
    if (loginRes) {
      //await getWorkspaces();
      MySelf.props.checkLogin();
    } else {
      MySelf.setState({showError:true});
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div className="hold-transition login-page">
        <Alert key={1} variant={'danger'} show={this.state.showError}>
          {sessionStorage.rbMessage}
        </Alert>
        <div className="login-box">
          <div className="card card-outline card-primary">
            <div className="card-header text-center">
              <a href="/" className="h1">{t('restshell')}</a>
            </div>
            <div className="card-body">
              <p className="login-box-msg">Sign in to start your session</p>

              <form onSubmit={this.doLogin}>
                <div className="input-group mb-3">
                  <input type="text" id="username" name="username" className="form-control" placeholder="Username" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-envelope"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input type="password" id="password" name="password" className="form-control" placeholder="Password" />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div className="row">

                  <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Login);



