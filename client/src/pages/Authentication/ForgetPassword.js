import React,  { useState } from 'react';
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import emailjs from 'emailjs-com';
import axios from 'axios';
// import http from "./http-common";


// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import profile from "../../assets/images/verification-img.png";
import logo from "../../assets/images/logo.svg";
import animationData from './9633-loading.json';
import Lottie from 'react-lottie';
import './style.css'


const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};


  const ForgetPasswordPage = (props) => {

  const [emailSuccsess, setemailSuccsess] = useState('');
  const [emailError, setemailError] = useState('');
  const [animation, setanimation] = useState(false);
  const [form, setForm] = useState(true)

  const showForm=()=>{
    if (form == true ) {
      return (<AvForm
        className="form-horizontal mt-4"
        onValidSubmit={(e,v) => handleValidSubmit(e,v)}>

        <div className="form-group assistant">
          <AvField
            name="email"
            label="אימייל"
            className="form-control assistant"
            placeholder="הכנס אימייל..."
            type="email"
            required
          />
        </div>
        <Row className="form-group">
          <Col className="text-right">
            <button
              className="btn btn-primary w-md waves-effect waves-light assistant"
              type="submit"
            >
              שלח אימייל
              </button>
          </Col>
        </Row>
      </AvForm>)
    }
  }

  const showAnimation=()=>{
    if (animation  == true) {
        return (<Lottie options={defaultOptions}
          height={200}
          width={200}/>)
    }
  }


  function handleValidSubmit(event, values) {
    setForm(false)
    setanimation(true)
    axios.get(`/users/finduser/${values.email}`)
    .then(res => {
      var templateParams = {email: res.data[0].email,
                            name: res.data[0].name,
                            password: res.data[0].password}

      emailjs.send('Satmar', 'template_774yhcp', templateParams, 'user_1DJhL1JIvrojfhnDYm4yw') //use your Service ID and Template ID
      .then(function(response) {
        setemailSuccsess('שלחנו לך אימייל עם פרטי המשתמש!')
        setemailError('')
        setForm(true)
        setanimation(false)
      },

      function(error) {
        alert(JSON.stringify(error))
        setemailError('לא הצלחנו כרגע לשלוח לך מייל, נסה שנית מאוחר יותר!')
        setemailSuccsess('')
        setForm(true)
        setanimation(false)
      }.bind(this));

      })

    .catch(function (error) {
        console.log(error)
        setemailError('אימייל הזה עדיין לא רשום במערכת!')
        setemailSuccsess('')
        setForm(true)
        setanimation(false)
    } .bind(this))
    
  }
     
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

                      {props.forgetError && props.forgetError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {props.forgetError}
                        </Alert>
                      ) : null}
                      {props.forgetSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {props.forgetSuccessMsg}
                        </Alert>
                      ) : null}

                      {showForm()}
                      {showAnimation()}

                            <div className='email-send-successfully'>{emailSuccsess}</div>
                            <div className='email-send-error'>{emailError}</div>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center register-text">
                <p className='assistant'>חזרה לדף <Link to="login" className="font-weight-medium text-primary assistant">התחברות</Link> </p>
                  <p dir='ltr'>© {new Date().getFullYear()} Skote. Created by <a href='https://vistateam.co.uk/' target='_blank'>VISTA</a></p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
      );
    }

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStatetoProps, { userForgetPassword })(ForgetPasswordPage)
);
