import React, { useState , useEffect } from 'react';

import { Link } from "react-router-dom";
import { Container, Row, Col, Table, Button, UncontrolledTooltip, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
// import Notiflix from "notiflix-react";
import Lottie from 'react-lottie';
import animationData from './9633-loading.json';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import http from "./http-common";


// Notiflix.Notify.Init({
//     fontFamily: 'Assistant',
//     useGoogleFont: true,
//     timeout: 5000
// }); 

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


const ChangesList = (props) => {

    const [changesData, setChangesData] = useState([{newData: {nameAll: 'temp', father: 'temp'}, byUser:{name: 'temp', email: 'temp'}}]);
    const [rowOne, setRowOne] = useState([{newData: {nameAll: 'temp', father: 'temp'}, byUser:{name: 'temp', email: 'temp'}}]);
    const [rowTwo, setRowTwo] = useState([{newData: {nameAll: 'temp', father: 'temp'}, byUser:{name: 'temp', email: 'temp'}}]);
    const [tempData , setTempData] = useState({})
    const [confirm_delete, setConfirm_delete] = useState(false)
    const [pointOfShow, setPointOfShow] = useState(10);
    const [showList, setShowList] = useState(false);
    const [showAnimation, setShowAnimation] = useState(true)


    useEffect(() => {

        var accountType = window.localStorage.getItem('pointName')
        if (accountType != 'hgdksnSHJS524JSBHAkxc7423c') {
            return window.location.replace('/')
        } else{
            getDataFromDB()
        }
          },[]);


    const getDataFromDB = ()=>{
        http.get(`/changes/getthechanges/`)
        .then(res =>{
            var resData = res.data.reverse()
            setChangesData(resData);
            sortData(resData, pointOfShow)
        })
        .catch(err=>{
            alert(err)
            console.log(err);
            // window.location.replace('/')
        })
    }

    const sortData = (r, n) => {
        var tempData = r.slice(0, n)
        let tempRowOne =  []
        let tempRowTwo = []
        for (let i = 0; i < tempData.length; i++) {
            if (i % 2 == 0) {
                tempRowOne.push(tempData[i])
            }
            else{
                tempRowTwo.push(tempData[i])
            }
        }

        setRowOne(tempRowOne);
        setRowTwo(tempRowTwo);
        return setShowList(true), setShowAnimation(false);
    }

    const recoverData=(d)=>{
        setTempData(d)
        if (d.type == 'Delete') {
            var obj = d.newData
            http.post('/names/newname', {obj})
            .then(res=>{
                // Notiflix.Notify.Success(`${obj.nameAll} שוחזר בהצלחה!`);
                http.delete(`/changes/deletechange/${d._id}`)
                .then(res=>{
                    getDataFromDB()
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
                // Notiflix.Notify.Success(`${obj.nameAll} שוחזר בהצלחה!`);
                http.delete(`/changes/deletechange/${d._id}`)
                .then(res=>{
                    getDataFromDB()
                })
                .catch(err=>{console.log(err);})
                })
                .catch(err=>{alert(err)})
            })
            .catch(err=>{console.log(err)})
        }
    }

    const showStatus=(t)=>{
        if (t == 'Change') {
            return (<span className="badge badge-warning assistant">שינוי פרטים</span>)
        }
        else if (t == 'New') {
            return (<span className="badge badge-success assistant">שם חדש</span>)
        }
        else{
            return (<span className="badge badge-danger assistant">מחיקת שם</span>)
        }
    }

    const deleteChange=()=>{
        http.delete(`/changes/deletechange/${tempData._id}`)
        .then(res=>{
            setConfirm_delete(false)
            getDataFromDB()
            // Notiflix.Notify.Success('השינוי נמחק בהצלחה!');
        })
        .catch(err=>{console.log(err);})
    }

    const showRecover=(t)=>{
        if (t.type == 'Change' || t.type == 'Delete') {
            return (<DropdownItem onClick={_=>{recoverData(t)}}>שיחזור</DropdownItem>)
        }
    }

    const loadMore=()=>{
        if (pointOfShow < changesData.length) {
            var temp =  pointOfShow + 10
            setPointOfShow(temp)
            sortData(changesData, temp)
        }
    }

    const animation=()=>{
        if (showAnimation == true) {
            return (<Lottie options={defaultOptions}
                height={200}
                width={200}
          />)
        }
    }

    const showListOfChanges = ()=>{

        if (showList == true) {
            return(<div>
            <Row>
                <Col lg="6">
                    <div className="">
                        <div className="table-responsive">
                            <Table className="project-list-table table-nowrap table-centered table-borderless">
                                <thead>
                                    <tr className='text-font-names'>
                                        <th scope="col">שינוים אצל איש קשר</th>
                                        <th scope="col">תאריך שינוי</th>
                                        <th scope="col">השתנה ע"י</th>
                                        <th scope="col"></th>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowOne.map((e,i)=>{
                                        return(
                                            <tr>
                                            <td >
                                                <h5 className="text-truncate font-size-14"><Link to={`changedetails/id${e._id}`} className="text-dark text-font-names">{e.newData.nameAll || '-----'}</Link></h5>
                                                {showStatus(e.type)}
                                            </td>
                                            <td><Link to={`changedetails/id${e._id}`}>{e.dateOfChange || '-----'}<br/>{e.timeOfChange || '-----'}</Link></td>
                                            <td>
                                                <h5 className="text-truncate font-size-14"><Link to={`changedetails/id${e._id}`} className="text-dark text-font-names">{e.byUser.name || '-----'}</Link></h5>
                                                <p className="text-muted mb-0 assistant ">{e.byUser.email || '-----'}</p>
                                            </td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle href="#" className="card-drop" tag="i">
                                                        <i className="mdi mdi-dots-horizontal font-size-18"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu right className='assistant'>
                                                        <DropdownItem href={`changedetails/id${e._id}`}>הצג</DropdownItem>
                                                        <DropdownItem onClick={_=>{setTempData(e); setConfirm_delete(true)}}>מחיקה</DropdownItem>
                                                        {showRecover(e)}
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                            <td></td>
                                        </tr>)
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>

                <Col lg="6">
                    <div className="">
                        <div className="table-responsive">
                            <Table className="project-list-table table-nowrap table-centered table-borderless">
                                <thead>
                                    <tr className='text-font-names'>
                                    <th scope="col">שינוים אצל איש קשר</th>
                                        <th scope="col">תאריך שינוי</th>
                                        <th scope="col">השתנה ע"י</th>
                                        <th scope="col"></th>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowTwo.map((e,i)=>{
                                        return(
                                            <tr>
                                            <td >
                                                <h5 className="text-truncate font-size-14"><Link to={`changedetails/id${e._id}`} className="text-dark text-font-names">{e.newData.nameAll || '-----'}</Link></h5>
                                                {showStatus(e.type)}
                                            </td>
                                            <td>{e.dateOfChange || '-----'}<br/>{e.timeOfChange || '-----'}</td>
                                            <td>
                                                <h5 className="text-truncate font-size-14"><Link to={`changedetails/id${e._id}`} className="text-dark text-font-names">{e.byUser.name || '-----'}</Link></h5>
                                                <p className="text-muted mb-0 assistant ">{e.byUser.email || '-----'}</p>
                                            </td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle href="#" className="card-drop" tag="i">
                                                        <i className="mdi mdi-dots-horizontal font-size-18"></i>
                                                    </DropdownToggle>
                                                    <DropdownMenu right className='assistant'>
                                                        <DropdownItem href={`changedetails/id${e._id}`}>הצג</DropdownItem>
                                                        <DropdownItem onClick={_=>{setTempData(e); setConfirm_delete(true)}}>מחיקה</DropdownItem>
                                                        {showRecover(e.type)}
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                            <td></td>
                                        </tr>)
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
            </Row>
                                    <Row>
                                    <Col xs="12">
                                        <div className="text-center my-3">
                                            <Link onClick={loadMore} className="text-success assistant"><i className="bx bx-loader bx-spin font-size-18 align-middle mr-2"></i> טען עוד... </Link>
                                        </div>
                                    </Col>
                                </Row>
        </div>)
        }
    }

    return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumbs */}
                        <Breadcrumbs title="שינוים שהתבצעו במערכת" />
                          {animation()}
                          {showListOfChanges()}
                    </Container>
                </div>

                {confirm_delete ? (
											<SweetAlert
                                                title="האם אתה בטוח?"
												warning
                                                showCancel
                                                confirmBtnText = "כן, מחק!"
                                                cancelBtnText = "ביטול"
												confirmBtnBsStyle="danger"
												cancelBtnBsStyle="light"
                                                onConfirm={deleteChange}
                                                onCancel={_=>{setConfirm_delete(false)}}
											>
                                האם אתה בטוח למחוק את השינוי הזה?	
                                </SweetAlert>
										) : null}
            </React.Fragment>
          );
    }
        
export default ChangesList;