import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, CardTitle, Container, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import http from "./http-common";


export default class AddName extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            showError: false,
            allName: '',
            familyInput: '',
            nameInput: '',
            Address: '',
            email: '',
            homePhone: '',
            mobile: '',
            homeMobile: '',
            note: '',
            father: '',
            showHomePhone: false,
            showMobile: false,
            showHomeMobile: false,
            selectedTitle: {},
            selectedGroup: {},
            selectedType: {},
            titleOptions:  [
                { label: "ר'", value: "ר'" },
                { label: "הרב", value: "הרב" },
                { label: "משפחת", value: "משפחת" }],

            typeOptions:  [
                { label: "ידידים", value: "ידידים" },
                { label: "מוסדות", value: "מוסדות" },
                { label: "אנ\"ש", value: "אנ\"ש" }],
            
            selectOptions:  [
                { label: "ירושלים", value: "ירושלים" },
                { label: "בני ברק", value: "בני ברק" },
                { label: "בית שמש", value: "בית שמש" },
                { label: "אלעד", value: "אלעד" },
                { label: "מודיעין עילית", value: "מודיעין-עילית" },
                { label: "ברכפלד", value: "ברכפלד" },
            ]
        }
    }

    postNewName=()=>{

        if (this.state.nameInput != ''  && this.state.familyInput != '') {
        var obj = {
            "nameAll": this.state.allName,
            "family": this.state.familyInput,
            "title": this.state.selectedTitle.value,
            "name": this.state.nameInput,
            "homePhone": this.state.homePhone,
            "mobile": this.state.mobile,
            "homeMobile": this.state.homeMobile,
            "Address": this.state.Address,
            "state": this.state.selectedGroup.value,
            "type": this.state.selectedType.value,
            "email": this.state.email.toLowerCase(),
            "father": this.state.father,
            "note": this.state.note,
        }
        
        http.post('/names/newname', {obj})
        .then(res => {
            this.props.addNewName(this.state.allName)
           })

        .catch(function (error) {
            console.log(error)
            alert('יש בעיה בשליחת הנתונים, אנא נסה שוב או פנה למוקד התמיכה של VISTA')
        } .bind(this))

    }
    else{
        this.setState({showError: true})
    }
    }


    showError=()=>{
        if (this.state.showError == true) {
            return (<div className='error-name'>*שם ושם משפחה חובה</div>)
        }
    }


    showAllName=()=>{
        if (this.state.allName.length > 0 && this.state.allName != ' ') {
            return (<div className='name-all-style'>{this.state.allName}</div>)
        }
    }

    showHomePhone=()=>{
        if (this.state.showHomePhone == true) {
            return (<div>
                 <Label className='assistant-font' htmlFor="family">מס' טלפון:</Label>
                 <Row className="mb-2">
                    <Col md="10">
                        <Input
                            onChange={_=>{this.setState({homePhone: String(_.target.value)})}}
                            type="number"
                            className="form-control assistant-font"
                            placeholder="הכנס מס' טלפון... " 
                                        />
                            </Col>
                            <Col md="2">
                            <Button
                            onClick={_=>{this.setState({homePhone: ''}, this.setState({showHomePhone: false}))}}
                            color="primary"
                            className="btn-block inner"
                            style={{ width: "100%" }}
                            >
                            {" "}
                            מחק{" "}
                            </Button>
                            </Col>
                            </Row>

            </div>)
        }
    }

    showMobile=()=>{
        if (this.state.showMobile == true) {
            return (<div>
                 <Label className='assistant-font' htmlFor="family">מס' פלאפון:</Label>
                 <Row className="mb-2">
                    <Col md="10">
                        <Input
                            onChange={_=>{this.setState({mobile: _.target.value})}}
                            type="text"
                            className="form-control assistant-font"
                            placeholder="הכנס מס' פלאפון... " 
                                        />
                            </Col>
                            <Col md="2">
                            <Button
                            onClick={_=>{this.setState({mobile: ''}, this.setState({showMobile: false}))}}
                            color="primary"
                            className="btn-block inner"
                            style={{ width: "100%" }}
                            >
                            {" "}
                            מחק{" "}
                            </Button>
                            </Col>
                                    </Row>

            </div>)
        }
    }

    showHomeMobile=()=>{
        if (this.state.showHomeMobile == true) {
            return (<div>
                 <Label className='assistant-font' htmlFor="family">מס' פלאפון 2:</Label>
                 <Row className="mb-2">
                    <Col md="10">
                        <Input
                            onChange={_=>{this.setState({homeMobile: String(_.target.value)})}}
                            type="number"
                            className="form-control assistant-font"
                            placeholder="הכנס מס' טלפון 2 ... " 
                            />
                            </Col>

                            <Col md="2">
                            <Button
                            onClick={_=>{this.setState({homeMobile: ''}, this.setState({showHomeMobile: false}))}}
                            color="primary"
                            className="btn-block inner"
                            style={{ width: "100%" }}
                            >
                            {" "}
                            מחק{" "}
                            </Button>
                            </Col>
                                    </Row>

            </div>)
        }
    }

    familyInput=(e)=>{
        this.setState({familyInput: e.target.value})
        this.setState({allName: e.target.value + ' ' + this.state.nameInput})
    }

    nameInput=(e)=>{
        this.setState({nameInput: e.target.value})
        this.setState({allName: this.state.familyInput + ' ' + e.target.value})
    }

    handleSelectGroup=(selectedGroup)=>{
        this.setState({selectedGroup: selectedGroup})
    }

    handleSelectTitle=(selectedTitle)=>{
        this.setState({selectedTitle: selectedTitle})
    }

    handleSelectType=(selectedType)=>{
        this.setState({selectedType: selectedType})
    }


    render() {
        return (
            <div>
            <ModalBody>
            <Row>
            <Col lg={12}>
                <Card>
                {this.showAllName()}
                <CardBody>
                    {this.showError()}
                 <div className='flex'>
                <Col lg={4}>
                        <FormGroup id='searchBy' className="select2-container assistant-font">
                        <Label className='assistant-font' htmlFor="family">תואר </Label>
                                <Select className='select-width'
                                    placeholder={<div>בחר</div>}
                                    onChange={this.handleSelectTitle}
                                    options={this.state.titleOptions}
                                    classNamePrefix="select2-selection"
                                    />
                            </FormGroup>
                        </Col>
                      
                        <Col lg={4}>
                        <FormGroup id='searchBy' className="select2-container assistant-font">
                        <Label className='assistant-font' htmlFor="family">סוג</Label>
                                <Select className='select-width'
                                    placeholder={<div>בחר</div>}
                                    onChange={this.handleSelectType}
                                    options={this.state.typeOptions}
                                    classNamePrefix="select2-selection"
                                    />
                            </FormGroup>
                        </Col>
                        </div>
                    <Form className="outer-repeater">
                    <div data-repeater-list="outer-group" className="outer">
                        <div data-repeater-item className="outer">
                        <div className="form-group">
                            <Label className='assistant-font' htmlFor="name">שם פרטי: </Label>
                            <Input
                            onChange={this.nameInput.bind(this)}
                            type="text"
                            id="name"
                            placeholder="הכנס שם פרטי..."
                            className="form-control assistant-font"
                            />
                        </div>

                        <div className="form-group">
                            <Label className='assistant-font' htmlFor="family">שם משפחה: </Label>
                            <Input
                            onChange={this.familyInput.bind(this)}
                            type="text"
                            id="family"
                            placeholder="הכנס שם משפחה..."
                            className="form-control assistant-font"
                            />
                        </div>

                        <div className="form-group">
                            <Label className='assistant-font' htmlFor="family">ב"ר וחתן: </Label>
                            <Input
                            onChange={_=>{this.setState({father: _.target.value})}}
                            type="text"
                            id="family"
                            placeholder="ב''ר... וחתן..."
                            className="form-control assistant-font"
                            />
                        </div>


                        <div className='flex'>
                        <Col lg={8}>
                        <div className="form-group">
                            <Label className='assistant-font' htmlFor="address">כתובת: </Label>
                            <Input
                            onChange={_=>{this.setState({Address: _.target.value})}}
                            type="text"
                            id="address"
                            placeholder="הכנס כתובת..."
                            className="form-control assistant-font"
                            />
                        </div>
                        </Col>

                        <Col lg={4}>
                        <FormGroup id='searchBy' className="select2-container assistant-font">
                        <Label className='assistant-font' htmlFor="family">עיר </Label>
                                <Select className='select-width'
                                    placeholder={<div>בחר</div>}
                                    onChange={this.handleSelectGroup }
                                    options={this.state.selectOptions}
                                    classNamePrefix="select2-selection"
                                    />
                            </FormGroup>
                        </Col>
                        </div>


                        <div className="form-group">
                            <Label className='assistant-font' htmlFor="formemail">אימייל: </Label>
                            <Input
                            onChange={_=>{this.setState({email: _.target.value})}}
                            type="email"
                            id="formemail"
                            placeholder="הכנס כתובת אימייל..."
                            className="form-control assistant-font"
                            />
                        </div>

                        {this.showHomePhone()}
                        {this.showMobile()}
                        {this.showHomeMobile()}


                        <div className='flex'>
                        <button onClick={_=>{this.setState({showHomePhone: true})}} type="button" className="btn btn-success waves-effect assistant-font waves-light margin-button">
                        <i className="bx bx-home font-size-16 align-middle mr-2"></i> הוסף מס' טלפון
                        </button>

                        <button onClick={_=>{this.setState({showMobile: true})}} type="button" className="btn btn-success waves-effect assistant-font waves-light margin-button">
                        <i className="bx bx-mobile-alt font-size-16 align-middle mr-2"></i> הוסף מס' פלאפון
                        </button>

                        <button onClick={_=>{this.setState({showHomeMobile: true})}} type="button" className="btn btn-success waves-effect assistant-font waves-light margin-button">
                        <i className="bx bx-mobile-alt font-size-16 align-middle mr-2"></i> הוסף מס' פלאפון 2
                        </button>

                        </div>

                        <FormGroup>
                            <Label className='assistant-font margin-top-notes' htmlFor="formmessage">הערה:</Label>
                            <Input
                            onChange={_=>{this.setState({note: _.target.value})}}
                            type="textarea"
                            id="formmessage"
                            className="form-control assistant-font"
                            rows="3"
                            />
                        </FormGroup>
                        <Button onClick={this.postNewName} className='btn-block assistant-font' color="primary">
                            הוסף
                        </Button>
                        {this.showError()}
                        </div>
                    </div>
                    </Form>
                </CardBody>
                </Card>
            </Col>
            </Row>
            </ModalBody>             
        </div>
        )
    }
}
