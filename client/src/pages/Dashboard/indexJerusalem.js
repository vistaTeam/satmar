import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import { Link } from "react-router-dom";
import axios from 'axios';
import './style.css';


//import Charts
import StackedColumnChart from "./StackedColumnChart";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import NameList from "./JerusalemNameList";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//i18n
import { withNamespaces } from 'react-i18next';

 const Dashboard = (props) => {


          return (
              <React.Fragment>
                <div >
                    <Container fluid>
                        <Row>
                            <Col lg="12">
                                <NameList/>
                            </Col>
                        </Row>
                    </Container>
                    </div >
            </React.Fragment>
          );
        }

export default withNamespaces()(Dashboard);