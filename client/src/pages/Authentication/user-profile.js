import React, { useState , useEffect } from 'react';
import { Container, Row, Col, Card,Alert, CardBody,Media, Button } from "reactstrap";

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// Redux
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumb from '../../components/Common/Breadcrumb';

import avatar from '../../assets/images/users/avatar-1.jpg';
// actions
import { editProfile } from '../../store/actions';
import http from "./http-common";

const UserProfile = (props) => { 

    const [email, setemail] = useState("");
    const [name, setname] = useState("");
    const [password, setpassword] = useState("");
    const [id, setid] = useState('')
    const [succsessName, setsuccsessName] = useState('')
    const [errorName, seterrorName] = useState('')
    const [succsessEmail, setsuccsessEmail] = useState('')
    const [errorEmail, seterrorEmail] = useState('')
    const [succsessPassword, setsuccsessPassword] = useState('')
    const [errorPassword, seterrorPassword] = useState('')
    const [idx, setidx] = useState(1);

   useEffect(() => {
           if(localStorage.getItem("authUser"))
           {
             const obj = JSON.parse(localStorage.getItem("authUser"));
             if(process.env.REACT_APP_DEFAULTAUTH === 'firebase')
             { 
                setname(obj.name);
                setemail(obj.email);
                setpassword(obj.password)
                setid(obj._id);
             }
              else if((process.env.REACT_APP_DEFAULTAUTH === 'fake') || (process.env.REACT_APP_DEFAULTAUTH === 'jwt'))
             {
                setname(obj.name);
                setemail(obj.email);
                setpassword(obj.password);
                setid(obj._id);

             }               
           }
      },[props.success]);

   const changeName=(event,values)=>{

    http.post(`/users/changename/${id}`, {values})
    .then(res => {
        window.localStorage.removeItem('authUser');
        window.localStorage.setItem('authUser', JSON.stringify(res.data));
        setname(values.name);
        setsuccsessName('שם הוחלף בהצלחה!')
        seterrorName('')
       })
    .catch(function (error) {
        seterrorName('תקלה במערכת! נסה מאוחר יותר!')
        setsuccsessName('')
    } .bind(this))
    
   }

   const changeEmail = (event,values)=>{

    http.post(`/users/changeemail/${id}`, {values})
    .then(res => {
        window.localStorage.removeItem('authUser');
        window.localStorage.setItem('authUser', JSON.stringify(res.data));
        setemail(values.email);
        setsuccsessEmail('אימייל הוחלף בהצלחה!')
        seterrorEmail('')

       })
    .catch(function (error) {
        setsuccsessEmail('')
        seterrorEmail('תקלה במערכת! נסה מאוחר יותר!')
    } .bind(this))
    
   }


   const changePassword = (event,values)=>{

    if (values.oldPassword != password) {
        setsuccsessPassword('')
        return seterrorPassword('סיסמא שהזנת לא נכונה!')
    }
    else if (values.newPassword != values.reNewPassword) {
        setsuccsessPassword('')
        return seterrorPassword('הסיסמא החדשה שהזנת לא תואם!')
    }

    http.post(`/users/changepassword/${id}`, {values})
    .then(res => {
        window.localStorage.removeItem('authUser');
        window.localStorage.setItem('authUser', JSON.stringify(res.data));
        setpassword(values.newPassword);
        setsuccsessPassword('סיסמא הוחלף בהצלחה!')
        seterrorPassword('')
       })
    .catch(function (error) {
        seterrorPassword('תקלה במערכת! נסה מאוחר יותר!')
        setsuccsessPassword('')
    } .bind(this))
    
   }

        return (
                  <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumb */}
                        <Breadcrumb title="איזור אישי" />

                         <Row>
                            <Col lg="6">
                             {props.error && props.error ? <Alert color="danger">{props.error}</Alert> : null}
                             {props.success && props.success ? <Alert color="success">{props.success}</Alert> : null}

                                <Card>
                                    <CardBody>
                                        <Media>
                                            <div className="mr-3">
                                                <img src={avatar} alt="" className="avatar-md rounded-circle img-thumbnail"/>
                                            </div>
                                            <Media body className="align-self-center">
                                                <div className="text-muted">
                                                    <h5 className='assistant name-title'>{name}</h5>
                                                    <p className="mb-0 assistant">{name}</p>
                                                    <p className="mb-1 assistant">{email}</p>
                                                </div>
                                            </Media>
                                        </Media>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                        <Col lg="6">
                        <h4 className="change-title mb-4 assistant">-- שנה שם --</h4>
                        <Card>
                            <CardBody>
                               <AvForm className="form-horizontal assistant" onValidSubmit={(e,v) => { changeName(e,v) }}>
                                    <div className="form-group assistant">
                                         <AvField name="name" label="שם" value={name} className="form-control" placeholder="הכנס שם..." type="text" required />
                                    </div>
                                     <div className="text-center mt-4 assistant">
                                         <Button type="submit" color="danger">שנה שם</Button>
                                    </div>
                               </AvForm>
                               <div className='email-send-successfully'>{succsessName}</div>
                               <div className='email-send-error'>{errorName}</div>

                            </CardBody>
                        </Card>
                        </Col>

                        <Col lg="6">
                        <h4 className="change-title mb-4 assistant">-- שנה אימייל --</h4>
                        <Card>
                            <CardBody>
                               <AvForm className="form-horizontal assistant" onValidSubmit={(e,v) => { changeEmail(e,v) }}>
                                    <div className="form-group assistant">
                                         <AvField name="email" label="אימייל" value={email} className="form-control" placeholder="הכנס אימייל..." type="text" required />
                                    </div>
                                     <div className="text-center mt-4 assistant">
                                         <Button type="submit" color="danger">שנה אימייל</Button>
                                    </div>
                               </AvForm>

                               <div className='email-send-successfully'>{succsessEmail}</div>
                               <div className='email-send-error'>{errorEmail}</div>

                            </CardBody>
                        </Card>
                        </Col>
                        </Row>


                        <Row>
                        <Col lg="2"></Col>
                        <Col lg="8">
                        <h4 className="change-title mb-4 assistant">-- שנה סיסמא --</h4>
                        <Card>
                            <CardBody>
                               <AvForm className="form-horizontal assistant" onValidSubmit={(e,v) => { changePassword(e,v) }}>
                                    <div className="form-group assistant">
                                         <AvField name="oldPassword" label="סיסמא ישנה" className="form-control" placeholder="הכנס סיסמא ישנה..." type="password" required />
                                         <AvField name="newPassword" label="סיסמא חדשה" className="form-control" placeholder="הכנס סיסמא חדשה..." type="password" required />
                                         <AvField name="reNewPassword" label="אשר סיסמא חדשה" className="form-control" placeholder="הכנס שוב את הסיסמא החדשה..." type="password" required />

                                    </div>
                                     <div className="text-center mt-4 assistant">
                                         <Button type="submit" color="danger">שנה סיסמא</Button>
                                    </div>
                               </AvForm>

                               <div className='email-send-successfully'>{succsessPassword}</div>
                               <div className='email-send-error'>{errorPassword}</div>
                            
                            </CardBody>
                        </Card>
                        </Col>
                        <Col lg="2"></Col>
                        </Row>

                    </Container>
                </div>
            </React.Fragment>
           );
        }
            
const mapStatetoProps = state => {
    const { error,success } = state.Profile;
    return { error,success };
}

export default withRouter(connect(mapStatetoProps, { editProfile })(UserProfile));

