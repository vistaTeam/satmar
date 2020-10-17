import React, { Component } from 'react';

import { Row, Col, CardBody, Card, Alert,Container } from "reactstrap";

// Redux
import { connect } from 'react-redux';
import { withRouter, Link, Route, Redirect } from 'react-router-dom';
import http from "./http-common";


// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// actions
import { loginUser,apiError } from '../../store/actions';

// import images
import profile from "../../assets/images/verification-img.png";
import logo from "../../assets/images/logo.svg";
import animationData from './9633-loading.json';
import Lottie from 'react-lottie';
import './style.css'
import AvInput from 'availity-reactstrap-validation/lib/AvInput';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };



    const mapStatetoProps = state => {
    const { error } = state.Login;
    return { error };
    }


export class Login extends Component{

    constructor(props) {
        super(props)
    
        this.state = {
             props: '',
             showLoginError: false,
             showForm: true,
             showAnimation: false,
             showLoginBlocked: false
        }
    }
    


  //handleValidSubmit
  handleValidSubmit=(event, values)=> {
      this.setState({showForm: false})
      this.setState({showAnimation: true})
    http.get(`/users/finduser/${values.email}`)
    .then(res => {

        var account = res.data[0]
        if (res.data[0].password == values.password) {

            http.post(`/users/rememberuser/${account._id}`, {values})
            .then(res =>{})
            .catch(error =>{console.log(error);})
            
            if (account.entryPermit == true) {
                    window.localStorage.setItem("authUser", JSON.stringify(account._id))
                    window.localStorage.setItem("setupTime", Date.now())
                    window.location.replace('/') 
            }
            else{
                this.setState({showForm: true})
                this.setState({showAnimation: false})
                this.setState({showLoginBlocked: true})
                this.setState({showLoginError: false})
            }
        }
        else{
            this.setState({showLoginError: true})
            this.setState({showForm: true})
            this.setState({showAnimation: false})
            this.setState({showLoginBlocked: false})

        }

       })

    .catch(function (error) {
        this.setState({showLoginBlocked: false})
        this.setState({showLoginError: true})
        this.setState({showForm: true})
        this.setState({showAnimation: false})
    } .bind(this))
    }

    loginError=()=>{
        if (this.state.showLoginError == true) {
            return(<div className='login-error'>פרטים לא נכונים, נסה שנית!</div>)
        }
    }

    showLoginBlocked=()=>{
        if (this.state.showLoginBlocked == true) {
            return(<div className='login-error'>החשבון הזה רשום, אך אין לך (עדיין) גישה, אתה יכול לשלוח אימייל למנהל עם בקשה שיאשר את החשבון <a href='mailto:418907@gmail.com'>418907@gmail.com</a></div>)
        }
    }

    showForm=()=>{
        if (this.state.showForm == true) {
            return(<AvForm className="form-horizontal" onValidSubmit={(e,v) => { this.handleValidSubmit(e,v) }}>

            <div className="form-group assistant">
                <AvField name="email" label="אימייל" className="form-control" placeholder="הכנס אימייל..." type="email" required />
            </div>

            <div className="form-group assistant">
                <AvField name="password" label="סיסמא" type="password" required placeholder="הכנס סיסמא..." />
            </div>

            <div className="custom-control custom-checkbox assistant">
                <AvInput name='remember' type="checkbox" className="custom-control-input" id="customControlInline" />
                <label className="custom-control-label" htmlFor="customControlInline">זכור אותי</label>
            </div>

            <div className="mt-3">
                <button className="btn btn-primary btn-block waves-effect waves-light assistant" type="submit">התחבר</button>
            </div>

            {this.loginError()}
            {this.showLoginBlocked()}

            <Link to="/forgot-password">
            <div className="mt-4 text-center forget-text">
            <div className="text-muted assistant"><i className="mdi mdi-lock mr-1"></i> אופס! שכחתי סיסמא</div>
            </div>
            </Link>
        </AvForm>)
        }
    }

    showAnimation=()=>{
        if (this.state.showAnimation == true) {
            return (<Lottie options={defaultOptions}
              height={200}
              width={200}/>)
        }
      }


    render() {
        return (
             <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-dark"><i className="fas fa-home h2"></i></Link>
                </div>
                <div className="account-pages my-5 pt-sm-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <Row>
                                            <Col className="col-7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary welcome-text">שלום וברכה!</h5>
                                                    <p className='welcome-second-text'>התחבר כאן להפעיל את המערכת
                                                    <br/><strong className='welcome-third-text'>רשימת אנ"ש דחסידי סאטמאר בארה"ק</strong></p>
                                                </div>
                                            </Col>
                                            <Col className="col-5 align-self-end">
                                                <img src={profile} alt="" className="img-fluid" />
                                            </Col>
                                        </Row>
                                    </div>
                                    <CardBody className="pt-0">
                                        <div>
                                            <Link to="/">
                                                <div className="avatar-md profile-user-wid mb-4">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img src={logo} alt="" className="rounded-circle" height="34" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="p-2">
                                            {this.showForm()}
                                            {this.showAnimation()}

                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-8 text-center register-text">
                                    <p className='assistant'>אין לך חשבון עדיין? <Link to="register" className="font-weight-medium text-primary assistant">הירשם למערכת</Link> </p>
                                    <p dir='ltr'>© {new Date().getFullYear()} Skote. Created by <a href='https://vistateam.co.uk/' target='_blank'>VISTA</a></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(connect(mapStatetoProps, { loginUser,apiError })(Login));