import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Container, Row, Col, Input, FormGroup, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import http from "./http-common";
import Lottie from 'react-lottie';
import animationData from './9633-loading.json';
import AddName from './AddName.js';
import EditName from './EditName.js';
import Notiflix from "notiflix-react";
import { CSVLink, CSVDownload } from "react-csv";



//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

Notiflix.Notify.Init({
    fontFamily: 'Assistant',
    useGoogleFont: true,
    timeout: 5000
}); 


const headers = [
    { label: "תואר", key: "title" },
    { label: "שם פרטי ושם משפחה", key: "nameAll" },
    { label: "שם פרטי", key: "name" },
    { label: "שם משפחה", key: "family" },
    { label: "כתובת", key: "Address" },
    { label: "עיר", key: "state" },
    { label: "משפחה מסביב", key: "father" },
    { label: "טלפון", key: "homePhone" },
    { label: "פלאפון", key: "mobile" },
    { label: "פלאפון 2", key: "homeMobile" },
    { label: "אימייל", key: "email" },
    { label: "סוג", key: "type" },
    { label: "הערה", key: "note" },
  ]


const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


export default class NameList extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            account: {},
            modal: false,
            modalNewName: false,
            modalEditName: false,
            nameDetails: {},
            data: [],
            dataForExport: [],
            allNames: [],
            searchData: [],
            splitList: [{test: true}],
            pointOfList: 0,
            selectedGroup: { label: "כללי", value: "general" },
            showAnimation: true,
            showData: false,
            noResults: false,
            confirm_both: false,
            success_dlg: false,
            error_dlg: false,
            editError: false,
            errorDownload: false,
            dynamic_title: '',
            dynamic_description: '',
            searchInput: '',
            selectOptions:  [
                { label: "כללי", value: "general" },
                { label: "שם ומשפחה", value: "nameAll" },
                { label: "משפחה", value: "family" },
                { label: "כתובת", value: "Address" },
                { label: "טלפון / פלאפון", value: "telephoneOrMobile" },
                { label: "מייל", value: "email" }
            ]
        }
    }

    componentDidMount=()=> {
        this.getDataFromDB();
        
        var accountID = JSON.parse(window.localStorage.getItem("authUser"))
        var account =  {};
        http.get(`/users/finduserbyid/${accountID}`)
        .then(res =>{
            account = res.data
            this.setState({account: account})
        })
        .catch(err=>{
            window.localStorage.clear()
            window.location.replace('/')
        })
    }

    getDataFromDB=()=>{
        this.setState({showAnimation: true})
        this.setState({showData: false})
        this.setState({searchInput: ''})


        http.get('/names/')
        .then(res => {

            var data = [];

            res.data.map((e)=>{
                if (e.state == 'בית שמש') {
                    data.push(e)
                }
            })
            this.setState({data: data})
            this.sortAndSetData(data)
            this.removeSlash(data)
           })

        .catch(function (error) {
            console.log(error)
            alert('יש בעיה בקבלת הנתונים, אנא נסה שוב או פנה למוקד התמיכה של VISTA')
        } .bind(this))
    }

    async dataForExport(data){

        var exportData = JSON.parse(JSON.stringify(data));

        exportData.map((e)=>{
            if (e.father) {
                let tempFather = e.father.replace(/"/g,'\'\'')
                e.father = tempFather
            }
            if (e.Address) {
                let tempAddress = e.Address.replace(/"/g,'\'\'')
                e.Address = tempAddress
            }
            if (e.family) {
                let tempFamily = e.family.replace(/"/g,'\'\'')
                e.family = tempFamily
            }
            if (e.name) {
                let tempName = e.name.replace(/"/g,'\'\'')
                e.name = tempName
            }
            if (e.family) {
                let tempNameAll = e.nameAll.replace(/"/g,'\'\'')
                e.nameAll = tempNameAll
            }
            if (e.type) {
                let tempType = e.type.replace(/"/g,'\'\'')
                e.type = tempType
            }
            if (e.note) {
                let tempNote = e.note.replace(/"/g,'\'\'')
                e.note = tempNote
            }
        })

        await this.setState({dataForExport: exportData})

    }

    removeSlash=(res)=>{
        var searchData = JSON.parse(JSON.stringify( res ));

        searchData.map((e,i)=>{
            if (e.mobile || e.homeMobile || e.homePhone) {
                if (e.mobile) {
                    let tempNo1 =  e.mobile.replace(/-/g,'')
                    e.mobile = tempNo1
                }
                if (e.homeMobile) {
                    let tempNo2 =  e.homeMobile.replace(/-/g,'')
                    e.homeMobile = tempNo2 
                }
                if (e.homePhone) {
                    let tempNo3 =  e.homePhone.replace(/-/g,'')
                    e.homePhone = tempNo3
                }
            } 
        })
        this.setState({searchData: searchData})
    }


    sortAndSetData=(d)=>{
        if (d.length > 0) {
        let data = d
        data.sort((a,b)=> (a.nameAll > b.nameAll)*2-1)
        this.setState({allNames: data})

        this.dataForExport(data)

        var idx = 0
        var result = []
        while (idx < data.length) {
            if (idx % 20 === 0) result.push([])
            result[result.length - 1].push(data[idx++])
        }

        this.setState({splitList: result})
        this.setState({pointOfList: 0})
        this.setState({showAnimation: false})
        this.setState({showData: true})
        this.setState({noResults: false})
    }
    else{
        this.setState({showAnimation: false})
        this.setState({noResults: true})
        this.setState({splitList: [{test: true}]})
        this.setState({allNames: []})
    }
}

    pointOfListAdd=()=>{
        if (this.state.pointOfList >= 0 && this.state.pointOfList < this.state.splitList.length - 1) {
            this.setState({pointOfList: this.state.pointOfList + 1})
        }
    }

    pointOfListRemove=()=>{
        if (this.state.pointOfList < this.state.splitList.length && this.state.pointOfList > 0) {
            this.setState({pointOfList: this.state.pointOfList - 1})
        }
    }

    addingNewName=(n)=>{
        Notiflix.Notify.Success(n +' '+ 'הוסף לרשימה!');
        this.setState({modalNewName: false})
        this.getDataFromDB()
    }

    editSuccess=(n)=>{
        Notiflix.Notify.Success(n +' '+ 'עודכן בהצלחה!');
        this.setState({modalEditName: false})
        this.getDataFromDB()
    }



    handleSelectGroup=(selectedGroup)=>{
        this.setState({selectedGroup: selectedGroup})
        this.searchInput(this.state.searchInput)
    }

    showAnimation=()=>{
        if (this.state.showAnimation == true) {
            return (<Lottie options={defaultOptions}
                height={200}
                width={200}
          />)
        }
    }

    deleteName=()=>{
        this.setState({confirm_both: false})
        http.delete(`/names/delete/${this.state.nameDetails._id}`)
        .then(res => {
            this.setState({modal: !this.state.modal})
            this.setState({success_dlg: true})
            this.setState({dynamic_title: "נמחק"})
            this.setState({dynamic_description: `${this.state.nameDetails.nameAll} נמחק בהצלחה.`})
            this.getDataFromDB()
           })

        .catch(function (error) {
            this.setState({error_dlg: true})
            this.setState({dynamic_title: "שגיאה"})
            this.setState({dynamic_description: 'לא הצלחנו למחוק כרגע אנא נסה שנית!'})
            this.getDataFromDB()
        } .bind(this))
    }

    async searchInput(s){

        if (typeof s == 'string') {
            await this.setState({searchInput: s})
        }
        else{
            await this.setState({searchInput: s.target.value.toLowerCase()})
        }

        if (this.state.selectedGroup.value != 'general' && this.state.selectedGroup.value != 'telephoneOrMobile') {
            var searchResults = this.state.data.filter((e)=> {
            return e.hasOwnProperty(this.state.selectedGroup.value)
            });
            if (this.state.selectedGroup.value == "Address") {
                searchResults = searchResults.filter((e,i)=> {
                return e.Address.includes(this.state.searchInput)
                });   
            }
            else if (this.state.selectedGroup.value == "nameAll") {
                searchResults = searchResults.filter((e,i)=> {
                return e.nameAll.includes(this.state.searchInput)
                });   
            }
            else if (this.state.selectedGroup.value == "family") {
                searchResults = searchResults.filter((e,i)=> {
                return e.family.includes(this.state.searchInput)
                });   
            }
            else if (this.state.selectedGroup.value == "state") {
                searchResults = searchResults.filter((e,i)=> {
                return e.state.includes(this.state.searchInput)
                });   
            }
            else if (this.state.selectedGroup.value == "email") {
                searchResults = searchResults.filter((e,i)=> {
                return e.email.includes(this.state.searchInput)
                });   
            }
        }

        else if ( this.state.selectedGroup.value == 'telephoneOrMobile') {
                
            var searchResults = [];
                this.state.searchData.map((e, i)=>{
                    if (e.mobile) {
                        if (e.mobile.includes(this.state.searchInput)){
                        return searchResults.push(this.state.data[i]) 
                        }
                    }

                    if (e.homePhone) {
                        if (e.homePhone.includes(this.state.searchInput)){
                        return searchResults.push(this.state.data[i]) 
                        }
                    }

                    if (e.homeMobileobile) {
                        if (e.homeMobile.includes(this.state.searchInput) ){
                        return searchResults.push(this.state.data[i]) 
                        }}
                })
        }

        else if ( this.state.selectedGroup.value == 'general') {
            var searchResults = []
            this.state.searchData.map((e, i) => {
                
                if (JSON.stringify(e)
                        .toString()
                        .includes(this.state.searchInput)) {

                searchResults.push(this.state.data[i])
                }});
        }


            if (searchResults.length > 0) {
                this.sortAndSetData(searchResults)
            }
            else{
                this.setState({showData: false})
                this.setState({noResults: true})
                this.sortAndSetData(searchResults)
            }
        
    }

    openNameDetails=(n)=>{
    this.setState({modal: !this.state.modal})
    this.setState({nameDetails: n})
    }

    openEditModal=()=>{
    this.setState({modal: false})
    this.setState({modalEditName: true})
    }

    showData=()=>{
        if (this.state.showData == true) {
            return (
                        <tbody>
                            {
                             this.state.splitList[this.state.pointOfList].map((name, key) =>
                                    <tr className='curser-hover' onClick={_=>{this.openNameDetails(name)}} key={key} >
                                        <td><Link to="#" className="text-body text-font-names">{name.nameAll}</Link></td>

                                        <td>
                                        <div className='text-body text-font-address'> {name.Address|| '----'}</div>
                                        </td>

                                        <td>
                                         <div className='text-font-address'>{name.state || '----'}</div>
                                         </td>

                                        <td>
                                         <div className='text-font-address'>{name.homePhone || '----'}</div>
                                        </td>

                                        <td>
                                         <div className='text-font-address'>{name.mobile || '----'}</div>
                                        </td>

                                        <td>
                                            <div className='text-font-address'>{name.homeMobile || '----'}</div>
                                        </td>
                                        </tr>
                                )}

                        </tbody>

            )
        }
    }

    noResults=()=>{
        if (this.state.noResults == true) {
            return(<div className='no-results'>אין תוצאות</div>)
        }
    }

    showDownload=()=>{
        if (this.state.account.allowedToDownload == true) {
            return(<button type="button" className="btn btn-light waves-effect assistant-font waves-light margin-button">
            <CSVLink data={this.state.dataForExport} filename={`רשימת אנש - ${this.state.searchInput}` + '.csv'} headers={headers}>
            <i className="bx bx-download font-size-16 align-middle mr-2"></i> הורד
            </CSVLink>
            </button>)
        }
        else{
            return(<button onClick={_=>{this.setState({errorDownload: true})}} type="button" className="btn btn-light waves-effect assistant-font waves-light margin-button">
            <i className="bx bx-download font-size-16 align-middle mr-2"></i> הורד
            </button>)
        }
    }

    newName=()=>{
        if (this.state.account.allowedToEdit == true) {
            this.setState({modalNewName: true})
        }
        else{
            return this.setState({editError: true})
        }
    }

    reqDeleteName=()=>{
        if (this.state.account.allowedToEdit == true) {
            return this.setState({confirm_both: true})
        }
        else{
            return this.setState({editError: true})
        }
    }

    reqEditName=()=>{
        if (this.state.account.allowedToEdit == true) {
            return this.openEditModal()
        }
        else{
            return this.setState({editError: true})
        }
    }

    
    showNote=()=>{
        if (this.state.account.allowedToEdit == true) {
            return(<h6 className="m-0 text-left text-notes text-primary">{this.state.nameDetails.note}</h6>)
        }
        else{
            return(<h6 style={{color: 'red'}} className="name assistant-font">אין לך אישור לראות הערות!</h6>)
        }
    }



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

                        <Col sm="2">
                        <FormGroup id='searchBy' className="select2-container assistant-font">
                                <Select className='select-width'
                                    placeholder={<div>כללי</div>}
                                    value={this.state.selectedGroup}
                                    onChange={this.handleSelectGroup }
                                    options={this.state.selectOptions}
                                    classNamePrefix="select2-selection"
                                    />
                            </FormGroup>
                    </Col>

                    <Col sm="4" className='flex'>
                        <div className="search-box mr-2 mb-2 d-inline-block">
                            <div className="position-relative">
                                <Input type="text" onChange={this.searchInput.bind(this)} value={this.state.searchInput} className="form-control assistant-font" placeholder="חיפוש..." />
                                <i className="bx bx-search-alt search-icon"></i>
                            </div>
                        </div>
                        </Col>
                        
                    <Col sm='2'>
                        {this.showDownload()}
                    </Col>


                    <Col sm="4">
                        <div className="text-sm-right">
                            <Button type="button" color="success" onClick={this.newName} className="btn-rounded waves-effect waves-light mb-2 mr-2 assistant-font"><i className="mdi mdi-plus mr-1"></i>הוסף שם חדש</Button>
                        </div>
                    </Col>
                </Row>

                <div className="table-responsive">
                    <Table className="table table-centered table-nowrap">
                        <thead className="thead-light text-font-names">
                            <tr>
                                <th>שם ומשפחה</th>
                                <th>כתובת</th>
                                <th>עיר</th>
                                <th>טלפון בבית</th>
                                <th>פלאפון</th>
                                <th>פלאפון בבית</th>
                            </tr>
                        </thead>
                  {this.showData()}

                </Table>
                </div>
                  {this.showAnimation()}
                  {this.noResults()}

                <Row className="mb-2">
                <Col sm="4">
                    <div className='total-results'>יש כרגע {this.state.allNames.length}  תוצאות, הנך נמצא בדף {this.state.pointOfList + 1} מתוך {this.state.splitList.length}</div>
                </Col>
                <Col sm="4"></Col>


                <Col sm="4">
                <div className='pagination pagination-rounded justify-content-end mb-2'>
                <Button type="button" color="primary" className="btn-pages" onClick={this.pointOfListRemove}>
                הקודם
                </Button>
                <Button type="button" color="primary" className="btn-pages" onClick={this.pointOfListAdd}>
                הבא
                </Button>
                </div>
                </Col>
                </Row>
                </CardBody>

                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Modal isOpen={this.state.modal} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={() => { this.setState({modal: !this.state.modal}) } }>
                    <div className="modal-content">
                        <ModalHeader toggle={() => {this.setState({modal: !this.state.modal}) } }>
                            <div className='modal-name-title'>{this.state.nameDetails.nameAll}</div>
                            <p className="mb-2 details-name"> <span className="text-primary">{this.state.nameDetails.father}</span></p>
                            <p className="mb-2 details-name"> <span className="type">{this.state.nameDetails.type}</span></p>
                            </ModalHeader >
                        <ModalBody>
                            <div className='flex'>
                            <p className="mb-2 details-name">תואר: <span className="text-primary name">{this.state.nameDetails.title}</span></p>
                            <p className="mb-2 details-name">שם כללי: <span className="text-primary name">{this.state.nameDetails.nameAll}</span></p>
                            </div>

                            <div className='flex'>
                            <p className="mb-2 details-name">שם משפחה: <span className="text-primary name">{this.state.nameDetails.family}</span></p>
                            <p className="mb-2 details-name">שם פרטי: <span className="text-primary name">{this.state.nameDetails.name}</span></p>
                            </div>

                            <div className='flex'>
                            <p className="mb-2 details-name">כתובת: <span className="text-primary name">{this.state.nameDetails.Address}</span></p>
                            <p className="mb-2 details-name">עיר: <span className="text-primary name">{this.state.nameDetails.state}</span></p>
                            </div>

                            <div className="table-responsive">
                                <Table>
                                    <div>                                        
                                            <td><i class="bx bx-home bx-sm icon-number m-0"></i></td>
                                            <td>
                                                <h6 className="m-0 text-right phone-title">טלפון בבית:</h6>
                                            </td>
                                            <td>
                                                <h6 className="m-0 text-right phone-number text-primary">{this.state.nameDetails.homePhone}</h6>
                                            </td>
                                    </div>

                                    <div>                                        
                                            <td><i class="bx bx-mobile-alt bx-sm icon-number m-0"></i></td>
                                            <td>
                                                <h6 className="m-0 text-right phone-title">פלאפון:</h6>
                                            </td>
                                            <td>
                                                <h6 className="m-0 text-right phone-number text-primary">{this.state.nameDetails.mobile}</h6>
                                            </td>
                                    </div>

                                    <div>                                        
                                            <td><i class="bx bx-mobile-alt bx-sm icon-number m-0"></i></td>
                                            <td>
                                                <h6 className="m-0 text-right phone-title">פלאפון בבית:</h6>
                                            </td>
                                            <td>
                                                <h6 className="m-0 text-right phone-number text-primary">{this.state.nameDetails.homeMobile}</h6>
                                            </td>
                                    </div>

                                    
                                    <div>                                        
                                            <td><i class="bx bx-mail-send bx-sm icon-number m-0"></i></td>
                                            <td>
                                                <h6 className="m-0 text-right phone-title">אימייל:</h6>
                                            </td>
                                            <td>
                                                <h6 className="m-0 text-right phone-number text-primary">{this.state.nameDetails.email}</h6>
                                            </td>
                                    </div>

                                    <div>                                        
                                            <td><i class="bx bx bx-notepad bx-sm icon-number m-0"></i></td>
                                            <td>
                                                <h6 className="m-0 text-right phone-title">הערה:</h6>
                                            </td>
                                            <td>
                                                {this.showNote()}
                                            </td>
                                    </div>
                                </Table>

                            </div>
                        </ModalBody>
                        <div className="button-items btn-edit-delete">
                        <button type="button" onClick={this.reqEditName} className="btn btn-primary waves-effect assistant-font waves-light">
                        <i className="bx bx bx-message-square-edit font-size-16 align-middle mr-2"></i> ערוך
                        </button>

                        <button type="button" onClick={this.reqDeleteName} className="btn btn-warning waves-effect assistant-font waves-light">
                        <i className="bx bx bxs-trash-alt font-size-16 align-middle mr-2"></i> מחיקה
                        </button>
                        </div>
                        
                        <ModalFooter>
                        <button type="button" onClick={() => { this.setState({modal: !this.state.modal}) } } className="btn btn-danger waves-effect assistant-font waves-light">
                        <i className="bx bx bx bx-window-close font-size-16 align-middle mr-2"></i> סגור
                        </button>
                        </ModalFooter>
                    </div>
                </Modal>

                <Modal isOpen={this.state.modalNewName} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={() => { this.setState({modalNewName: !this.state.modalNewName}) } }>
                <div className="modal-content">
                        <ModalHeader toggle={() => {this.setState({modalNewName: !this.state.modalNewName}) } }>
                        <div className='modal-name-title'>הוספת שם חדש</div>
                        </ModalHeader >

                  <AddName addNewName={this.addingNewName}/>

                  <ModalFooter>
                        <button type="button" onClick={() => { this.setState({modalNewName: !this.state.modalNewName}) } } className="btn btn-danger waves-effect assistant-font waves-light">
                        <i className="bx bx bx bx-window-close font-size-16 align-middle mr-2"></i> סגור
                        </button>
                        </ModalFooter>
                  </div>
                </Modal>

                <Modal isOpen={this.state.modalEditName} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={() => { this.setState({modalEditName: !this.state.modalEditName}) } }>
                <div className="modal-content">
                        <ModalHeader toggle={() => {this.setState({modalEditName: !this.state.modalEditName}) } }>
                        <div className='modal-name-title'>{this.state.nameDetails.nameAll}</div>
                        </ModalHeader >

                  <EditName editSuccess={this.editSuccess} nameDetails={this.state.nameDetails}/>
                  
                  <ModalFooter>
                        <button type="button" onClick={() => { this.setState({modalEditName: !this.state.modalEditName}) } } className="btn btn-danger waves-effect assistant-font waves-light">
                        <i className="bx bx bx bx-window-close font-size-16 align-middle mr-2"></i> סגור
                        </button>
                        </ModalFooter>
                  </div>
                </Modal>

                {this.state.confirm_both ? (
											<SweetAlert
                                                title="האם אתה בטוח?"
												warning
                                                showCancel
                                                confirmBtnText = "מחק"
                                                cancelBtnText = "ביטול"
												confirmBtnBsStyle="danger"
												cancelBtnBsStyle="light"
												onConfirm={this.deleteName}
												onCancel={() =>
													{
                                                    this.setState({confirm_both: false})
                                                    this.setState({error_dlg: true})
                                                    this.setState({dynamic_title: "מבוטל!"})
                                                    this.setState({dynamic_description: `${this.state.nameDetails.nameAll} לא נמחק.`})
													}
												}
											>
												אתה הולך למחוק את {this.state.nameDetails.nameAll}
											</SweetAlert>
										) : null}

                        {this.state.success_dlg ? (
							<SweetAlert
								success
                                title={this.state.dynamic_title}
                                confirmBtnText = "אישור"
								onConfirm={() => { this.setState({success_dlg: false})}}
							>
								{this.state.dynamic_description}
							</SweetAlert>
						) : null}


                    {this.state.error_dlg ? (
							<SweetAlert
								error
                                title={this.state.dynamic_title}
                                confirmBtnText = "אישור"
								onConfirm={() => { this.setState({error_dlg: false})}}
							>
								{this.state.dynamic_description}
							</SweetAlert>
						) : null}


                        {this.state.errorDownload ? (
											<SweetAlert
												title={
													<span className='error-download'>
														הגישה חסום!
                        </span>
												}
                                                warning
                                                confirmBtnText = "אישור"
												onConfirm={() =>{ this.setState({errorDownload: false})}}
											>
												<div className='assistant-font'>כרגע אין לך גישה להוריד קבצים!</div>
											</SweetAlert>
										) : null}

                            {this.state.editError ? (
											<SweetAlert
												title={
													<span className='error-download'>
														הגישה חסום!
                        </span>
												}
                                                warning
                                                confirmBtnText = "אישור"
												onConfirm={() =>{ this.setState({editError: false})}}
											>
												<div className='assistant-font'>כרגע אין לך גישה לשנות, למחוק או להוסיף שמות!</div>
											</SweetAlert>
										) : null}

            </React.Fragment>
            </div>
        )
    }
}