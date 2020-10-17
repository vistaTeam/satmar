import React from 'react';
import { Link } from "react-router-dom";
import { Row, Col, BreadcrumbItem } from "reactstrap";

const Breadcrumb = (props) => {
  return (
     <Row>
                    <Col xs="12">
                        <div className="page-title-box d-flex align-items-center assistant-font justify-content-between mainTitle">
                            <h4 className="mb-0 font-size-18">{props.title}</h4>
                            <div className="page-title-right assistant-font">
                             <ol className="breadcrumb m-0">
                                     <BreadcrumbItem>
                                        <Link to="#">{props.title}</Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        <Link to="#">{props.breadcrumbItem}</Link>
                                    </BreadcrumbItem>
                            </ol>
                            </div>
                        </div>
                    </Col>
                </Row>
  );
}

export default Breadcrumb;