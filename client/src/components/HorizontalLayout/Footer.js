import React from 'react';
import { Container, Row, Col } from "reactstrap";

const Footer = (props) => {
  return (
   <React.Fragment>
            <footer className="footer">
                <Container fluid={true}>
                    <Row>
                        <Col md={6}>
                            {new Date().getFullYear()} © Skote by <a target="_blank" href='https://vistateam.co.uk/'>VISTA</a>.
                        </Col>
                        <Col md={6}>
                            <div className="text-sm-right d-none d-sm-block">
                                Design & Develop by VISTA
                            </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
  );
}

export default Footer;