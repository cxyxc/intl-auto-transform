import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Card} from 'antd';
import {customerType, sex, credentialType, payMethod, loanChannel} from '../Enum';
import {FORM_ITEM_LAYOUT_OPTIONS, ROW_FORM_ITEM_LAYOUT_OPTIONS} from '../constants';
import {conventEnumValueToString, formatAmount} from '../utils';
const FormItem = Form.Item;

const formItemLayout = {
    ...FORM_ITEM_LAYOUT_OPTIONS
};

const formItemLayout2 = {
    ...ROW_FORM_ITEM_LAYOUT_OPTIONS
};


const CustomerDetailInfo = props => {
    const name = [];
    if(props.data.regionName)
        name.push(props.data.regionName);
    if(props.data.provinceName)
        name.push(props.data.provinceName);
    if(props.data.cityName)
        name.push(props.data.cityName);
    if(props.data.districtName)
        name.push(props.data.districtName);
    return (
        <Card title={props.getString('CUSTOMER_INFO')}>
            <Form className="form-standard">
                <Row>
                    <Col span={8}>
                        <FormItem label={props.getString('CUSTOMER_NAME')} {...formItemLayout}>
                            <span className="value-font">{props.data.customerName}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('CELLNUMBER')} {...formItemLayout}>
                            <span className="value-font">{props.data.cellNumber}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('SEX')} {...formItemLayout}>
                            <span className="value-font">{conventEnumValueToString(sex, props.data.sex, props.language)}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={props.getString('CUSTOMER_TYPE')} {...formItemLayout}>
                            <span className="value-font">{conventEnumValueToString(customerType, props.data.customerType, props.language)}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('CREDENTIAL_TYPE')} {...formItemLayout}>
                            <span className="value-font">{conventEnumValueToString(credentialType, props.data.credentialType, props.language)}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('CREDENTIAL_NUMBER')} {...formItemLayout}>
                            <span className="value-font">{props.data.credentialNumber}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={props.getString('CONSULTANT_NAME')} {...formItemLayout}>
                            <span className="value-font">{props.data.consultantName}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('PAYMETHOD')} {...formItemLayout}>
                            <span className="value-font">{conventEnumValueToString(payMethod, props.data.payMethod, props.language)}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('LOANCHANNEL')} {...formItemLayout}>
                            <span className="value-font">{conventEnumValueToString(loanChannel, props.data.loanChannel, props.language)}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={props.getString('WECHAT')} {...formItemLayout}>
                            <span className="value-font">{props.data.weChat}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('DRIVER_NAME')} {...formItemLayout}>
                            <span className="value-font">{props.data.driverName}</span>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={props.getString('DRIVER_PHONENUMBER')} {...formItemLayout}>
                            <span className="value-font">{props.data.driverPhoneNumber}</span>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label={props.getString('REGION')} {...formItemLayout2}>
                        <span className="value-font">{name.join('/')}</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={props.getString('DETAIL_ADDRESS')} {...formItemLayout2}>
                        <span className="value-font">{props.data.detailAddress}</span>
                    </FormItem>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormItem label={props.getString('ADVANCEDEPOSIT')} {...formItemLayout}>
                            <span className="value-font">{formatAmount(props.data.advanceDeposit)}</span>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

CustomerDetailInfo.propTypes = {
    data: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
};

import {connect} from 'react-redux';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getDetail = selectorFactory(['page', 'domainData', 'retailContractDetail', 'data']);

const mapStateToProps = state => ({
    data: getDetail(state),
});

export default connect(mapStateToProps, null)(localize(CustomerDetailInfo));
