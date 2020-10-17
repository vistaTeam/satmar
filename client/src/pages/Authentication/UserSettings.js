import React, { Component } from 'react';
import http from "./http-common";
import { Link } from "react-router-dom";
import { Container, Row, Col, Input, FormGroup, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import Lottie from 'react-lottie';
import animationData from './9633-loading.json';
import Notiflix from "notiflix-react";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import './style.css'


Notiflix.Notify.Init({
    fontFamily: 'Assistant',
    useGoogleFont: true,
    timeout: 5000
}); 


const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };



export default class UserSettings extends Component {


    constructor(props) {
        super(props)
    
        this.state = {
             account: {},
             users: [{}],
             showUsers:[{}],
             noResults: false,
             showData: false,
             showAnimation: true,
             administratorError: false,
             confirm_both: false,
             tempUser: {},
             tempUserId: '',
             confirm_delete: false

        }
    }
    

    async componentDidMount(){

        var accountID = JSON.parse(window.localStorage.getItem("authUser"))
        await http.get(`/users/finduserbyid/${accountID}`)
        .then(res =>{
            const account = res.data
            this.setState({account: account});
        })
        .catch(err=>{
            window.localStorage.clear()
            window.location.replace('/')
        })

        if (this.state.account.administrator == false) {
            window.location.replace('/') 
        }

        await this.getDataFromDb()
        this.setState({showData: true});
        this.setState({showAnimation: false});
    }

    getDataFromDb=()=>{
        http.get('/users').then(res =>{this.setState({users: res.data}, this.setState({showUsers: res.data}))})
    }

    searchUser=(s)=>{
        var searchResults = [];
         searchResults = this.state.users.filter((e,i)=> {
            return e.email.includes(s.target.value) || e.name.includes(s.target.value)
        })
        this.setState({showUsers: searchResults})

        if (searchResults.length == 0) {
            this.setState({noResults: true})
        }
        else{
            this.setState({noResults: false})
        }
    }

    noResults=()=>{
        if (this.state.noResults == true) {
            return(<div className='no-results'>אין תוצאות</div>)
        }
    }

    showAnimation=()=>{
        if (this.state.showAnimation == true) {
            return (<Lottie options={defaultOptions}
                height={200}
                width={200}
          />)
        }
    }
    
    getTheClass=(s)=>{
        if (s == true) {
            return 'success'
        }
        else{
            return 'danger'
        }
    }

    getTheStatus=(s)=>{
        if (s == true) {
            return 'מאושר'
        }
        else{
            return 'לא מאושר'
        }
    }

    changeEntryStatus=(id)=>{
        if (id == this.state.account._id) {
            return this.setState({administratorError: true})
        }
        var user = this.state.users.filter(e => e._id == id);
        user = user[0];
        user.entryPermit = !user.entryPermit
        http.post(`/users/changeStatus/${user._id}`, {user})
        .then(res =>{
            this.getDataFromDb()
            Notiflix.Notify.Success('השינוי נשמר במערכת!');
        })
        .catch(err=>{console.log(err)
            Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
        })
    }

    
    changeDownloadStatus=(id)=>{
        if (id == this.state.account._id) {
            return this.setState({administratorError: true})
        }
        var user = this.state.users.filter(e => e._id == id);
        user = user[0];
        user.allowedToDownload = !user.allowedToDownload
        http.post(`/users/changeStatus/${user._id}`, {user})
        .then(res =>{
            this.getDataFromDb()
            Notiflix.Notify.Success('השינוי נשמר במערכת!');
        })
        .catch(err=>{console.log(err)
            Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
        })
    }

    changeEditStatus=(id)=>{
        if (id == this.state.account._id) {
            return this.setState({administratorError: true})
        }
        var user = this.state.users.filter(e => e._id == id);
        user = user[0];
        user.allowedToEdit= !user.allowedToEdit
        http.post(`/users/changeStatus/${user._id}`, {user})
        .then(res =>{
            this.getDataFromDb()
            Notiflix.Notify.Success('השינוי נשמר במערכת!');
        })
        .catch(err=>{console.log(err)
            Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
        })
    }

    changeAdministratorStatus=(id)=>{
        var user = this.state.users.filter(e => e._id == id);
        user = user[0];

        if (user._id == this.state.account._id) {
            return this.setState({administratorError: true})
        }

        if (user.administrator == true) {
            user.administrator = false
            http.post(`/users/changeStatus/${user._id}`, {user})
            .then(res =>{
                this.getDataFromDb()
                Notiflix.Notify.Success('השינוי נשמר במערכת!');
            })
            .catch(err=>{console.log(err)
                Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
            })
        }
        else{
            this.setState({tempUser: user})
            this.setState({confirm_both : true})
        }}

    confirmAdministrator=()=>{
        this.setState({confirm_both: false})
        var user = this.state.tempUser

        user.allowedToEdit = true;
        user.allowedToDownload = true;
        user.entryPermit = true;
        user.administrator = true;

        http.post(`/users/changeStatus/${user._id}`, {user})
        .then(res =>{
            this.getDataFromDb()
            Notiflix.Notify.Success('השינוי נשמר במערכת!');
        })
        .catch(err=>{console.log(err)
            Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
        })
    }

    deleteUser=(u)=>{

        if (u == this.state.account._id) {
            return this.setState({administratorError: true})
        }

        this.setState({tempUserId: u})
        this.setState({confirm_delete: true})
    }

    deleteTheUser=()=>{
        this.setState({confirm_delete: false})
        http.delete(`/users/deleteuser/${this.state.tempUserId}`)
        .then(res =>{
            this.getDataFromDb()
            Notiflix.Notify.Warning('המשתמש נמחק בהצלחה!');
        })
        .catch(err=>{console.log(err)
            Notiflix.Notify.Failure('בעייה במערכת נסה שוב מאוחר יותר!')
        })
    }



    showData=()=>{
        if (this.state.showData == true) {
            return (
                        <tbody>
                            {
                             this.state.showUsers.map((user, key) =>
                                    <tr key={key} >
                                        <td><Link to="#" className="text-body text-font-names">{user.name}</Link></td>

                                        <td>
                                        <div className='text-body'><a href={`mailto:${user.email}`}>{user.email || '----'}</a></div>
                                        </td>

                                        
                                        <td>
                                        <div className='text-body'>{user.lastLoginDate || '----'}<br/>{user.lastLoginTime || '----'}</div>
                                        </td>

                                        <td>
                                        <Badge onClick={_=>{this.changeEntryStatus(user._id)}} className={"font-size-16 assistant curser-hover-settings badge-soft-" + this.getTheClass(user.entryPermit)} pill>
                                        {this.getTheStatus(user.entryPermit)}
                                        </Badge>
                                         </td>

                                        <td>
                                        <Badge onClick={_=>{this.changeDownloadStatus(user._id)}} className={"font-size-16 assistant curser-hover-settings badge-soft-" + this.getTheClass(user.allowedToDownload)} pill>
                                        {this.getTheStatus(user.allowedToDownload)}
                                        </Badge>
                                        </td>

                                        <td>
                                        <Badge onClick={_=>{this.changeEditStatus(user._id)}} className={"font-size-16 assistant curser-hover-settings badge-soft-" + this.getTheClass(user.allowedToEdit)} pill>
                                        {this.getTheStatus(user.allowedToEdit)}
                                        </Badge>
                                        </td>

                                        <td>
                                        <Badge onClick={_=>{this.changeAdministratorStatus(user._id)}}  className={"font-size-16 assistant curser-hover-settings badge-soft-" + this.getTheClass(user.administrator)} pill>
                                        {this.getTheStatus(user.administrator)}
                                        </Badge>                                  
                                        </td>

                                        <td>
                                        <i onClick={_=>{this.deleteUser(user._id)}} className="mdi mdi-delete font-size-22 mr-5 hover-delete" id="edittooltip"></i>
                                        </td>
                                        </tr>
                                )}
                        </tbody>)}}
    render() {
        return (
            <div>
                <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="רשימת אנ''ש דחסידי סאטמאר בארה''ק"/>
                        <Row>
                            <Col xs="12">
                                <Card>
                                <CardBody>
                <Row className="mb-2">


                    <Col sm="4" className='flex'>
                        <div className="search-box mr-2 mb-2 d-inline-block">
                            <div className="position-relative">
                                <Input onChange={this.searchUser.bind(this)} type="text" className="form-control assistant-font" placeholder="חיפוש..." />
                                <i className="bx bx-search-alt search-icon"></i>
                            </div>
                        </div>
                        </Col>

                </Row>

                <div className="table-responsive">
                    <Table className="table table-centered table-nowrap">
                        <thead className="thead-light text-font-names">
                            <tr>
                                <th>שם ומשפחה</th>
                                <th>אימייל</th>
                                <th>נצפה</th>
                                <th>כניסה</th>
                                <th>עריכה</th>
                                <th>הורדה</th>
                                <th> <div className='danger-settings'>מנהל</div></th>
                                <th>מחיקה</th>
                            </tr>
                        </thead>
                  {this.showData()}

                </Table>
                </div>
                  {this.noResults()}
                  {this.showAnimation()}

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

                {this.state.administratorError ? (
											<SweetAlert
												title={
													<span className='error-download'>
														שגיאה!
                        </span>
												}
                                                warning
                                                confirmBtnText = "אישור"
												onConfirm={() =>{ this.setState({administratorError: false})}}
											>
												<div className='assistant-font'>אתה לא יכול לשנות או למחוק את החשבון שלך!</div>
											</SweetAlert>
										) : null}

                {this.state.confirm_both ? (
											<SweetAlert
                                                title="אתה בטוח לאשר אותו כמנהל?"
												warning
                                                showCancel
                                                confirmBtnText = "כן, מאשר!"
                                                cancelBtnText = "ביטול"
												confirmBtnBsStyle="danger"
												cancelBtnBsStyle="light"
                                                onConfirm={this.confirmAdministrator}
                                                onCancel={_=>{this.setState({confirm_both: false})}}
											>
                                                אם אתה מאשר אותו להיות מנהל הוא יקבל גישה לכל דבר, וגם להגדרות משתמשים!
											</SweetAlert>
										) : null}


                            {this.state.confirm_delete ? (
											<SweetAlert
                                                title="האם אתה בטוח?"
												warning
                                                showCancel
                                                confirmBtnText = "כן, מחק!"
                                                cancelBtnText = "ביטול"
												confirmBtnBsStyle="danger"
												cancelBtnBsStyle="light"
                                                onConfirm={this.deleteTheUser}
                                                onCancel={_=>{this.setState({confirm_delete: false})}}
											>
                                האם אתה בטוח למחוק את המשתמש?	
                                </SweetAlert>
										) : null}

            </React.Fragment>
                
            </div>
        )
    }
}
