import React, { useEffect, useState } from 'react';
import { Row, Col, CardBody, Card, Alert,Container } from "reactstrap";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { registerUser,apiError,registerUserFailed } from "../../store/actions";

// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import emailjs from 'emailjs-com';
// import http from "./http-common";
import axios from 'axios';

// import images
import profileImg from "../../assets/images/verification-img.png";
import logoImg from "../../assets/images/logo.svg";
import animationData from './9633-loading.json';
import animationSuccess from './25176-success.json';
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

const successAnimation = {
  loop: true,
  autoplay: true,
  animationData: animationSuccess,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};


const Register = (props) => {

  const [registerSuccsess, setregisterSuccsess] = useState('');
  const [registerError, setregisterError] = useState('');
  const [animation, setanimation] = useState(false);
  const [showAnimationSuccess, setshowAnimationSuccess] = useState(false);
  const [form, setForm] = useState(true)


  const showForm = () => {
    if (form == true) {
      return (
        <AvForm
        className="form-horizontal"
        onValidSubmit={(e,v) => {handleValidSubmit(e,v)}}
      >
        {props.user && props.user ? (
          <Alert color="success">
            Register User Successfully
          </Alert>
        ) : null}
        {props.registrationError &&
          props.registrationError ? (
            <Alert color="danger">
              {props.registrationError}
            </Alert>
          ) : null}

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

        <div className="form-group assistant">
          <AvField
            name="name"
            label="שם"
            type="text"
            required
            placeholder="הכנס שם..."
          />
        </div>
        <div className="form-group assistant">
          <AvField
            name="password"
            label="סיסמא"
            type="password"
            required
            placeholder="הכנס סיסמא..."
          />
        </div>

        <div className="form-group assistant">
          <AvField
            name="rePassword"
            label="אשר סיסמא"
            type="password"
            required
            placeholder="הכנס שוב את הסיסמא..."
          />
        </div>

        <div className="mt-4">
          <button
            className="btn btn-primary btn-block waves-effect waves-light assistant"
            type="submit"
          >
           הירשם
          </button>
        </div>

      </AvForm>

      )
    }
  }

  const showAnimation=()=>{
    if (animation == true) {
        return(<Lottie options={defaultOptions}
          height={200}
          width={200}/>)
    }
  }

  const showAnimation2=()=>{
    if (showAnimationSuccess == true) {
        return(<Lottie options={successAnimation}
          height={200}
          width={200}/>)
    }
  }


  const showBackToLogin=()=>{
    if (registerSuccsess != '') {
      return ( <Link to='login'>
                <div className="mt-4">
                <button className="btn btn-primary btn-block waves-effect waves-light assistant">
                התחבר לחשבון החדש
                </button>
              </div></Link>)
        }
  }


    // handleValidSubmit
  function handleValidSubmit(event, values) {
    setForm(false)
    setanimation(true)

    if (values.password != values.rePassword) {
      setForm(true)
      setanimation(false)
      return setregisterError('הסיסמאות לא תואמות')
    }


    axios.get(`/users/finduser/${values.email}`)
    .then(res => {

      if (JSON.stringify(res.data).includes('email')) {
            setanimation(false)
            setForm(true)
            return setregisterError('האימייל הזה רשום כבר במערכת, אם שכחת את הסיסמא אתה יכול לבקש תזכורת לסיסמא!')
      }

      else {

        axios.post(`/users/newuser/`, {values})
        .then(res => {
        setanimation(false)
        setshowAnimationSuccess(true)
        setregisterError('')
        sendEmailForManager(values)
        setregisterSuccsess('נרשמת בהצלחה!, כרגע אין לך עדיין גישה, שלחנו מייל למנהל עם הפרטים שלך, באם הנך זכאי המנהל יאשר אותך, ותקבל אישור במייל.')
       })

    .catch(function (error) {
        console.log(error)
        alert('יש בעיה בקבלת הנתונים, אנא נסה שוב או פנה למוקד התמיכה של VISTA')
    } .bind(this))}

      })

    .catch(function (error) {
      alert(error)
      console.log(error);
      setregisterError('קיימת בעייה בקבלת הנתונים, פנה לקבוצת התמיכה של VISTA')
    } .bind(this))

  }

  function sendEmailForManager(v) {

    var templateParams = {email: v.email, name: v.name}
      emailjs.send('Satmar', 'template_cphq24n', templateParams, 'user_1DJhL1JIvrojfhnDYm4yw') //use your Service ID and Template ID
      .then(function(response) {
      },
      function(error) {
      }.bind(this));
  }

   useEffect(() => {
        props.registerUserFailed("");
      });

    return (
         <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="fas fa-home h2"></i>
          </Link>
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
                      <p className='welcome-second-text'>הירשם כאן להפעיל את המערכת
                      <br/><strong className='welcome-third-text'>רשימת אנ"ש דחסידי סאטמאר בארה"ק</strong></p>
                      </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profileImg} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logoImg}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">

                      {showForm()}
                      {showAnimation()}
                      {showAnimation2()}

                      <div className='register-send-successfully'>{registerSuccsess}</div>
                      <div className='email-send-error'>{registerError}</div>
                      {showBackToLogin()}
              
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center register-text">
                <p className='assistant'>יש לך חשבון כבר? <Link to="login" className="font-weight-medium text-primary assistant">התחבר</Link> </p>
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
  const { user, registrationError, loading } = state.Account;
  return { user, registrationError, loading };
};

export default connect(mapStatetoProps, { registerUser,apiError,registerUserFailed })(Register);
