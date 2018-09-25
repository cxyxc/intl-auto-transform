import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Row, Col, InputNumber, Card} from 'antd';
import TextInput from 'Shared/components/TextInput';
import {customerType, sex, credentialType, payMethod, loanChannel} from '../Enum';
import {FORM_ITEM_LAYOUT_OPTIONS, ROW_FORM_ITEM_LAYOUT_OPTIONS, AMOUNT_FORMATTER} from '../constants';
import CustomSelect from '../common/CustomSelect';
import RegionSelect from '../common/RegionSelect';
import {ADD_OR_UPDATE_INFO_TYPE} from './constants';
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    ...FORM_ITEM_LAYOUT_OPTIONS
};

const formItemLayout2 = {
    ...ROW_FORM_ITEM_LAYOUT_OPTIONS
};


class CustomerInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleAdvanceDepositBlur = this.handleAdvanceDepositBlur.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);
    }

    handleFilterChange(value, id) {
        this.props.saveData({[id]: value});
    }

    handleAdvanceDepositBlur(value) {
        this.props.saveData({advanceDeposit: value});
    }

    handleRegionChange(value, name, valueData) {
        this.props.saveData({[name]: value,
            regions: valueData});
    }
    render() {
        const disabled = this.props.disabled;
        const customerTypeOptions = customerType.map(t => <Option key={t.value} value={t.value.toString()}>{t.text}</Option>, this.props.language);
        const sexOptions = sex.map(state => <Option key={state.value} value={state.value.toString()}>{state.text}</Option>, this.props.language);
        const credentialTypeOptions = credentialType.map(state => <Option key={state.value} value={state.value.toString()}>{state.text}</Option>, this.props.language);
        const payMethodOptions = payMethod.map(t => <Option key={t.value} value={t.value.toString()}>{t.text}</Option>, this.props.language);
        const loanChannelOptions = loanChannel.map(state => <Option key={state.value} value={state.value.toString()}>{state.text}</Option>, this.props.language);
        const consultantlOptions = this.props.consultants.map(c => <Option key={c.userId} value={c.userId}>{c.name}</Option>);
        return (
            <Card title={this.props.getString('CUSTOMER_INFO')}>
                <Form className="form-standard">
                    <Row>
                        <Col span={8}>
                            <FormItem label={this.props.getString('CUSTOMER_NAME')} {...formItemLayout} required>
                                <TextInput id="customerName" disabled={disabled} value={this.props.data.customerName} onBlur={this.handleFilterChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('CELLNUMBER')} {...formItemLayout} required>
                                <TextInput id="cellNumber" disabled={disabled} value={this.props.data.cellNumber} onBlur={this.handleFilterChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('SEX')} {...formItemLayout} required>
                                <CustomSelect id="sex" options={sexOptions} disabled={disabled}
                                    value={this.props.data.sex ? this.props.data.sex.toString() : ''} onChange={this.props.saveData}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={this.props.getString('CUSTOMER_TYPE')} {...formItemLayout} required>
                                <CustomSelect id="customerType" options={customerTypeOptions} disabled={disabled}
                                    value={this.props.data.customerType ? this.props.data.customerType.toString() : ''} onChange={this.props.saveData}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('CREDENTIAL_TYPE')} {...formItemLayout} required>
                                <CustomSelect id="credentialType" options={credentialTypeOptions} disabled={disabled}
                                    value={this.props.data.credentialType === undefined ? '' : this.props.data.credentialType.toString()} onChange={this.props.saveData}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('CREDENTIAL_NUMBER')} {...formItemLayout} required>
                                <TextInput id="credentialNumber" disabled={disabled} value={this.props.data.credentialNumber} onBlur={this.handleFilterChange} />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <FormItem label={this.props.getString('REGION')} {...formItemLayout2} required>
                            <RegionSelect name="regionId" value={this.props.data.regionId || []} onChange={this.handleRegionChange}
                                defaultOption={this.props.regionSelectDefaultOption} disabled={disabled} />
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem label={this.props.getString('CONSULTANTNAME')} {...formItemLayout2} required>
                            <TextInput id="detailAddress" disabled={disabled} value={this.props.data.detailAddress} onBlur={this.handleFilterChange} />
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={this.props.getString('PAYMETHOD')} {...formItemLayout} required>
                                <CustomSelect id="consultantId" disabled={disabled}
                                    value={this.props.data.consultantId ? this.props.data.consultantId.toString() : ''}
                                    onChange={this.props.saveData} options={consultantlOptions}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('LOAN_CHANNEL')} {...formItemLayout} required>
                                <CustomSelect id="payMethod" options={payMethodOptions} disabled={disabled}
                                    value={this.props.data.payMethod === undefined ? '' : this.props.data.payMethod.toString()} onChange={this.props.saveData}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('WECHAT')} {...formItemLayout}>
                                <CustomSelect id="loanChannel" options={loanChannelOptions} disabled={disabled}
                                    value={this.props.data.loanChannel ? this.props.data.loanChannel.toString() : ''} onChange={this.props.saveData}/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={this.props.getString('DRIVER_NAME')} {...formItemLayout}>
                                <TextInput id="driverName" disabled={disabled} value={this.props.data.driverName} onBlur={this.handleFilterChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('DRIVER_PHONENUMBER')} {...formItemLayout}>
                                <TextInput id="driverPhoneNumber" disabled={disabled} value={this.props.data.driverPhoneNumber} onBlur={this.handleFilterChange}/>
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label={this.props.getString('DETAIL_ADDRESS')} {...formItemLayout}>
                                <TextInput id="weChat" disabled={disabled} value={this.props.data.weChat} onBlur={this.handleFilterChange} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <FormItem label={this.props.getString('ADVANCEDEPOSIT')} {...formItemLayout}>
                                <InputNumber id="advanceDeposit" min={0} disabled={disabled}
                                    {...AMOUNT_FORMATTER}
                                    value={this.props.data.advanceDeposit} onChange={this.handleAdvanceDepositBlur}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        );
    }
}

CustomerInfo.propTypes = {
    consultants: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    saveData: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    regionSelectDefaultOption: PropTypes.object,
};
CustomerInfo.defaultOption = {
    disabled: false
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getAddedData = selectorFactory(['page', 'appState', 'customerInfo']);
const getConsultants = selectorFactory(['page', 'domainData', 'initData', 'consultants']);

const mapStateToProps = state => ({
    data: getAddedData(state),
    consultants: getConsultants(state),
});

const mapDispatchToProps = dispatch => ({
    saveData: obj => dispatch(actions.saveAddData(obj, ADD_OR_UPDATE_INFO_TYPE.customerInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(CustomerInfo));
