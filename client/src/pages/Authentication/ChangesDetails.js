import React, { Component } from 'react'
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import { Container, Row, Col, Input, FormGroup, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import Lottie from 'react-lottie';
import animationData from './9633-loading.json';
import Notiflix from "notiflix-react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import './style.css'
import http from "./http-common";


Notiflix.Notify.Init({
    fontFamily: 'Assistant',
    useGoogleFont: true,
    timeout: 5000
}); 

export default class ChangesDetails extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
            changeData: {},
            confirm_delete: false,
        }
    }


    componentDidMount() {
    let tempLocation = window.location.href.indexOf('id')
    let location = window.location.href.substring(tempLocation + 2, window.location.href.length)

    axios.get(`/changes/findchange/${location}`)
    .then(res => {
       this.setState({changeData: res.data})
    })
    .catch(function (error) {
        // window.location.replace('/');
    } .bind(this))
}

deleteChange=()=>{
    http.delete(`/changes/deletechange/${this.state.changeData._id}`)
    .then(res=>{
        Notiflix.Notify.Success('השינוי נמחק בהצלחה!');
        window.location.replace('/changes');
    })
    .catch(err=>{console.log(err);})
}

recoverData=()=>{
    var d = this.state.changeData
    if (d.type == 'Delete') {
        var obj = d.newData
        http.post('/names/newname', {obj})
        .then(res=>{
            Notiflix.Notify.Success(`${obj.nameAll} שוחזר בהצלחה!`);
            http.delete(`/changes/deletechange/${d._id}`)
            .then(res=>{
                window.location.replace('/changes');
            })
            .catch(err=>{console.log(err);})
        })
        .catch(err=>{alert(err)})
    }

    else if(d.type == 'Change'){
        var obj = d.oldData
        http.delete(`/names/delete/${d.oldData._id}`)
        .then (res=>{
            http.post('/names/newname', {obj})
            .then(res=>{
            Notiflix.Notify.Success(`${obj.nameAll} שוחזר בהצלחה!`);
            http.delete(`/changes/deletechange/${d._id}`)
            .then(res=>{
                window.location.replace('/changes');
            })
            .catch(err=>{console.log(err);})
            })
            .catch(err=>{alert(err)})
        })
        .catch(err=>{console.log(err)})
    }
}

showChanges=()=>{
    if (this.state.changeData.type == 'Change') {
        return(<Row>
                <Col sm="5">
                    <div className='title-changes'>גירסא ישנה</div>
                    <div className='allName-title'>{this.state.changeData.oldData.nameAll}</div>
                    <div className='father-style'>{this.state.changeData.oldData.father}</div>
                    <div className='type-title'>{this.state.changeData.oldData.type}</div>
                    <hr/>

                    <Row className='rows-style'>
                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-id-card font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>תואר: </span><span className='text-primary'>{this.state.changeData.oldData.title  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-user-circle font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם פרטי: </span><span className='text-primary'>{this.state.changeData.oldData.name  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bxs-user-detail font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם משפחה: </span><span className='text-primary'>{this.state.changeData.oldData.family  || '----'}</span></p>
                        </Col>

                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>כתובת: </span><span className='text-primary'>{this.state.changeData.oldData.Address  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>עיר: </span><span className='text-primary'>{this.state.changeData.oldData.state  || '----'}</span></p>
                        </Col>
                    </Row>
                    <hr/>

                    <Row className='rows-style'>
                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>טלפון בבית: </span><span className='text-primary'>{this.state.changeData.oldData.homePhone  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון: </span><span className='text-primary'>{this.state.changeData.oldData.mobile  || '----'}</span></p>
                        </Col>

                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון בבית: </span><span className='text-primary'>{this.state.changeData.oldData.homeMobile  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-mail-send font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>אימייל: </span><span className='text-primary'>{this.state.changeData.oldData.email  || '----'}</span></p>
                        </Col>
                    </Row>
                    <hr/>
                    <p className="text-rows"><i className="bx bxs-note font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>הערה: </span><span className='text-primary'>{this.state.changeData.oldData.note  || '----'}</span></p>
                    <hr/>

                    <div className="button-items assistant">
                      <button onClick={this.recoverData} type="button" className="btn btn-warning waves-effect waves-light btn-changes">
                        <i className="bx bx-recycle font-size-16 align-middle mr-2"></i> שחזור גירסא ישנה
                                            </button>
                      <button onClick={_=>{this.setState({confirm_delete: true})}} type="button" className="btn btn-danger waves-effect waves-light btn-changes">
                        <i className="bx bxs-trash-alt font-size-16 align-middle mr-2"></i> מחיקת שינוי זה
                                            </button>
                        <Link to='/changes'><button type="button" className="btn btn-primary waves-effect waves-light btn-changes">
                        <i className="bx bx-right-arrow-circle font-size-16 align-middle mr-2"></i>חזרה לרשימת השינוים
                                            </button></Link>
                    </div>
                </Col>



                <Col sm="2" className='padding-top'></Col>
                <Col sm="5">
                <div className='title-changes'>גירסא חדשה</div>
                <div className='allName-title'>{this.state.changeData.newData.nameAll}</div>
                <div className='father-style'>{this.state.changeData.newData.father}</div>
                <div className='type-title'>{this.state.changeData.newData.type}</div>
                <hr/>

                <Row className='rows-style'>
                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-id-card font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>תואר: </span><span className='text-primary'>{this.state.changeData.newData.title  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-user-circle font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם פרטי: </span><span className='text-primary'>{this.state.changeData.newData.name  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bxs-user-detail font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם משפחה: </span><span className='text-primary'>{this.state.changeData.newData.family  || '----'}</span></p>
                        </Col>

                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bxs-location-plus font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>כתובת: </span><span className='text-primary'>{this.state.changeData.newData.Address  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-current-location font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>עיר: </span><span className='text-primary'>{this.state.changeData.newData.state  || '----'}</span></p>
                        </Col>
                    </Row>

                    <hr/>
                    <Row className='rows-style'>
                        <Col sm='6'>
                        <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>טלפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homePhone || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון: </span><span className='text-primary'>{this.state.changeData.newData.mobile  || '----'}</span></p>
                        </Col>

                        <Col sm='6'>
                    <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homeMobile  || '----'}</span></p>
                    <p className="text-rows"><i className="bx bx-mail-send font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>אימייל: </span><span className='text-primary'>{this.state.changeData.newData.email  || '----'}</span></p>
                        </Col>
                    </Row>
                    <hr/>
                    <p className="text-rows"><i className="bx bxs-note font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>הערה: </span><span className='text-primary'>{this.state.changeData.newData.note  || '----'}</span></p>
                    <hr/>
                </Col>
        </Row>)
    }

    else if (this.state.changeData.type == 'New') {
        return(<Row>
            <Col sm="5">
                <div className='title-changes'>גירסא ישנה</div>
                <div className='allName-title'>{this.state.changeData.newData.nameAll}</div>
                <div className='father-style'>{this.state.changeData.newData.father}</div>
                <div className='type-title'>{this.state.changeData.newData.type}</div>
                <hr/>

                <Row className='rows-style'>
                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-id-card font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>תואר: </span><span className='text-primary'>{this.state.changeData.newData.title  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-user-circle font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם פרטי: </span><span className='text-primary'>{this.state.changeData.newData.name  || '----'}</span></p>
                <p className="text-rows"><i className="bx bxs-user-detail font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם משפחה: </span><span className='text-primary'>{this.state.changeData.newData.family  || '----'}</span></p>
                    </Col>

                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>כתובת: </span><span className='text-primary'>{this.state.changeData.newData.Address  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>עיר: </span><span className='text-primary'>{this.state.changeData.newData.state  || '----'}</span></p>
                    </Col>
                </Row>
                <hr/>

                <Row className='rows-style'>
                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>טלפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homePhone  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון: </span><span className='text-primary'>{this.state.changeData.newData.mobile  || '----'}</span></p>
                    </Col>

                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homeMobile  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mail-send font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>אימייל: </span><span className='text-primary'>{this.state.changeData.newData.email  || '----'}</span></p>
                    </Col>
                </Row>
                <hr/>
                <p className="text-rows"><i className="bx bxs-note font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>הערה: </span><span className='text-primary'>{this.state.changeData.newData.note  || '----'}</span></p>
                <hr/>

                <div className="button-items assistant">
                  <button onClick={_=>{this.setState({confirm_delete: true})}} type="button" className="btn btn-danger waves-effect waves-light btn-changes">
                    <i className="bx bxs-trash-alt font-size-16 align-middle mr-2"></i> מחיקת שינוי זה
                                        </button>
                    <Link to='/changes'><button type="button" className="btn btn-primary waves-effect waves-light btn-changes">
                    <i className="bx bx-right-arrow-circle font-size-16 align-middle mr-2"></i>חזרה לרשימת השינוים
                                        </button></Link>
                </div>
            </Col>
    </Row>
    )
    }
    else if (this.state.changeData.type == 'Delete') {
        return(<Row>
            <Col sm="5">
                <div className='title-changes'>גירסא ישנה</div>
                <div className='allName-title'>{this.state.changeData.newData.nameAll}</div>
                <div className='father-style'>{this.state.changeData.newData.father}</div>
                <div className='type-title'>{this.state.changeData.newData.type}</div>
                <hr/>

                <Row className='rows-style'>
                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-id-card font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>תואר: </span><span className='text-primary'>{this.state.changeData.newData.title  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-user-circle font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם פרטי: </span><span className='text-primary'>{this.state.changeData.newData.name  || '----'}</span></p>
                <p className="text-rows"><i className="bx bxs-user-detail font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>שם משפחה: </span><span className='text-primary'>{this.state.changeData.newData.family  || '----'}</span></p>
                    </Col>

                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>כתובת: </span><span className='text-primary'>{this.state.changeData.newData.Address  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>עיר: </span><span className='text-primary'>{this.state.changeData.newData.state  || '----'}</span></p>
                    </Col>
                </Row>
                <hr/>

                <Row className='rows-style'>
                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-phone font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>טלפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homePhone  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון: </span><span className='text-primary'>{this.state.changeData.newData.mobile  || '----'}</span></p>
                    </Col>

                    <Col sm='6'>
                <p className="text-rows"><i className="bx bx-mobile-alt font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>פלאפון בבית: </span><span className='text-primary'>{this.state.changeData.newData.homeMobile  || '----'}</span></p>
                <p className="text-rows"><i className="bx bx-mail-send font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>אימייל: </span><span className='text-primary'>{this.state.changeData.newData.email  || '----'}</span></p>
                    </Col>
                </Row>
                <hr/>
                <p className="text-rows"><i className="bx bxs-note font-size-16 align-middle text-primary mr-1"></i><span className='title-rows'>הערה: </span><span className='text-primary'>{this.state.changeData.newData.note  || '----'}</span></p>
                <hr/>

                <div className="button-items assistant">
                <button onClick={this.recoverData} type="button" className="btn btn-warning waves-effect waves-light btn-changes">
                        <i className="bx bx-recycle font-size-16 align-middle mr-2"></i> שחזור גירסא ישנה
                                        </button>
                  <button onClick={_=>{this.setState({confirm_delete: true})}} type="button" className="btn btn-danger waves-effect waves-light btn-changes">
                    <i className="bx bxs-trash-alt font-size-16 align-middle mr-2"></i> מחיקת שינוי זה
                                        </button>
                    <Link to='/changes'><button type="button" className="btn btn-primary waves-effect waves-light btn-changes">
                    <i className="bx bx-right-arrow-circle font-size-16 align-middle mr-2"></i>חזרה לרשימת השינוים
                                        </button></Link>
                </div>
            </Col>
    </Row>
    )
    }
}

    
    render() {
        
        return (
            <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="הצגת שינוים"/>
                    <Row>
                        <Col xs="12">
                            <Card>
                            <CardBody>
                    {this.showChanges()}
            <Row className="mb-2">
            <Col sm="4">
            </Col>
            <Col sm="4"></Col>


            <Col sm="4">
            </Col>
            </Row>
            </CardBody>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {this.state.confirm_delete ? (
											<SweetAlert
                                                title="האם אתה בטוח?"
												warning
                                                showCancel
                                                confirmBtnText = "כן, מחק!"
                                                cancelBtnText = "ביטול"
												confirmBtnBsStyle="danger"
												cancelBtnBsStyle="light"
                                                onConfirm={this.deleteChange}
                                                onCancel={_=>{this.setState({confirm_delete: false})}}
											>
                                האם אתה בטוח למחוק את השינוי הזה?	
                                </SweetAlert>
										) : null}
        </React.Fragment>
        )
    }
}
