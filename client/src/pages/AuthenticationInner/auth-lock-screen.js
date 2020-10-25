import React,  { useState } from 'react';

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import { Link } from "react-router-dom";
import http from "../../http-common";


import { Container, Row, Col, CardBody, Card, Button } from "reactstrap";

// import images
import profileImg from "../../assets/images/verification-img.png";
import logoImg from "../../assets/images/logo.svg";
import avatar from "../../assets/images/users/avatar-1.jpg";

const LockScreen = (props) => {

    const [LoginError, setLoginError] = useState('');
    const [account, setAccount] = useState({});


    var accountID = JSON.parse(window.localStorage.getItem("authUser"))
    http.get(`/users/finduserbyid/${accountID}`)
    .then(res =>{
        const account = res.data
        setAccount(account);
    })
    .catch(err=>{
		window.location.replace('/')
    })


    const unlock = (e, v)=>{
        if (v.password == account.password) {
            window.location.replace('/')
        }
        else{
            setLoginError('סיסמא לא נכונה, נסה שנית!')
        }
    }

    return (
             <React.Fragment>
                <div className="home-btn d-none d-sm-block">
                    <Link to="/" className="text-dark"><i className="fas fa-home h2"></i></Link>
                </div>
                <div className="account-pages my-5 pt-sm-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="8" lg="6" xl="5">
                                <Card className="overflow-hidden">
                                    <div className="bg-soft-primary">
                                        <Row>
                                            <Col xs="7">
                                                <div className="text-primary p-4">
                                                    <h5 className="text-primary welcome-text">נעילת מסך</h5>
                                                    <p className='welcome-second-text'>הכנס סיסמא לשחרר נעילה!</p>
                                                </div>
                                            </Col>
                                            <Col xs="5" className="align-self-end">
                                                <img src={profileImg} alt="" className="img-fluid"/>
                                            </Col>
                                        </Row>
                                    </div>
                                    <CardBody className="pt-0"> 
                                        <div>
                                            
                                                <div className="avatar-md profile-user-wid mb-4">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <img src={logoImg} alt="" className="rounded-circle" height="34"/>
                                                    </span>
                                                </div>
                                            
                                        </div>
                                        <div className="p-2">
                                            <AvForm onValidSubmit={(e,v) => { unlock (e,v) }} className="form-horizontal">
                    
                                                <div className="user-thumb text-center mb-4">
                                                    <img src={avatar} className="rounded-circle img-thumbnail avatar-md" alt="thumbnail"/>
                                                    <h5 className="font-size-15 mt-3 assistant">{account.name}</h5>
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
                    
                                                <div className="form-group row mb-0">
                                                    <Col xs="12" className="text-right">
                                                        <Button color="primary" className=" w-md waves-effect waves-light assistant" type="submit">שחרר נעילה</Button>
                                                    </Col>
                                                </div>

                                            </AvForm>
                                            <div className='email-send-error'>{LoginError}</div>
                                        </div>
                    
                                    </CardBody>
                                </Card>
                                <div className="mt-5 text-center">
                                <p className='assistant'>זה לא אתה? <Link to="login" className="font-weight-medium text-primary assistant">התחבר למערכת</Link> </p>
                                    <p dir='ltr'>© {new Date().getFullYear()} Skote. Created by <a href='https://vistateam.co.uk/' target='_blank'>VISTA</a></p>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
          );
    }
export default LockScreen;

