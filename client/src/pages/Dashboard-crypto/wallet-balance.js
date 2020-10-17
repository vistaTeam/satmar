import React from 'react';
import { Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

import ReactApexChart from 'react-apexcharts';

const  series  = [76,67,61];
const walletOptions = {
                plotOptions: {
                    radialBar: {
                        offsetY:0,
                        startAngle:0,
                        endAngle:270,
                        hollow: {
                            margin:5,
                            size:"35%",
                            background:"transparent",
                            image:void 0},
                            track: {
                                show:!0,
                                startAngle:void 0,
                                endAngle:void 0,
                                background:"#f2f2f2",
                                strokeWidth:"97%",
                                opacity:1,
                                margin:12,
                                dropShadow: {
                                    enabled:!1,
                                    top:0,
                                    left:0,
                                    blur:3,
                                    opacity:.5
                                }
                            },
                            dataLabels: {
                                name: {
                                    show:!0,
                                    fontSize:"16px",
                                    fontWeight:600,
                                    offsetY:-10
                                },
                                value: {
                                    show:!0,
                                    fontSize:"14px",
                                    offsetY:4,
                                    formatter: function(e){return e+"%"}
                                },
                                total: {
                                    show:!0,
                                    label:"Total",
                                    color:"#373d3f",
                                    fontSize:"16px",
                                    fontFamily:void 0,
                                    fontWeight:600,
                                    formatter:function(e){return e.globals.seriesTotals.reduce(function(e,t){return e+t},0)+"%"}
                                }
                            }
                        }
                    },
                    stroke: {
                        lineCap:"round"
                    },
                    colors:["#3452e1","#f1b44c","#50a5f1"],
                    labels:["Ethereum","Bitcoin","Ethereum"],
                    legend:{show:!1}
                };

 const WalletBalance = (props) => {
          return (
           
            <React.Fragment>
                <Col xl="8">
                    <Card>
                        <CardBody>
                            <div className="float-right">
                                <select className="custom-select custom-select-sm ml-2">
                                    <option value="1" defaultValue>March</option>
                                    <option value="2">February</option>
                                    <option value="3">January</option>
                                    <option value="4">December</option>
                                </select>
                            </div>
                            <h4 className="card-title mb-3">Wallet Balance</h4>

                            <Row>
                                <Col lg="4">
                                    <div className="mt-4">
                                        <p>Available Balance</p>
                                        <h4>$ 6134.39</h4>

                                        <p className="text-muted mb-4"> + 0.0012.23 ( 0.2 % ) <i className="mdi mdi-arrow-up ml-1 text-success"></i></p>

                                        <Row>
                                            <Col xs="6">
                                                <div>
                                                    <p className="mb-2">Income</p>
                                                    <h5>$ 2632.46</h5>
                                                </div>
                                            </Col>
                                            <Col xs="6">
                                                <div>
                                                    <p className="mb-2">Expense</p>
                                                    <h5>$ 924.38</h5>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className="mt-4">
                                            <Link to="#" className="btn btn-primary btn-sm">View more <i className="mdi mdi-arrow-right ml-1"></i></Link>
                                        </div>
                                    </div>
                                </Col>

                                <Col lg="4" sm="6">
                                    <div>
                                        <div id="wallet-balance-chart" className="apex-charts">
                                            <ReactApexChart options={walletOptions} series={series} type="radialBar" height={280} />  
                                        </div>
                                    </div>
                                </Col>

                                <Col lg="4" sm="6" className="align-self-center">
                                    <div>
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 mr-2 text-primary"></i> Ethereum</p>
                                        <h5>4.5701 ETH = <span className="text-muted font-size-14">$ 1123.64</span></h5>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 mr-2 text-warning"></i> Bitcoin</p>
                                        <h5>0.4412 BTC = <span className="text-muted font-size-14">$ 4025.32</span></h5>
                                    </div>

                                    <div className="mt-4 pt-2">
                                        <p className="mb-2"><i className="mdi mdi-circle align-middle font-size-10 mr-2 text-info"></i> Litecoin</p>
                                        <h5>35.3811 LTC = <span className="text-muted font-size-14">$ 2263.09</span></h5>
                                    </div>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </React.Fragment>
          );
        }

export default WalletBalance;