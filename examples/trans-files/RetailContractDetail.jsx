import React from 'react';
import PropTypes from 'prop-types';
import {Spin, Card, Divider} from 'antd';
import {customerType, sex, retailContractStatus, retailContractPayStatus, credentialType, payMethod, loanChannel} from '../Enum';
import moment from 'moment';
import {DATA_FORMAT, DATATIME_FORMAT} from '../constants';
import {formatAmount} from '../utils';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
const {Description} = DescriptionList;

class RetailContractDetail extends React.PureComponent {
    componentDidMount() {
        this.props.queryInitData(this.props.id);
    }

    render() {
        let credentialTypeText = '';
        if(this.props.data.credentialType !== undefined)
            credentialTypeText = credentialType.has(this.props.data.credentialType) ? credentialType.properties[this.props.data.credentialType].getText(this.props.language) : null;
        const regionString = [];
        if(this.props.data.regionName)
            regionString.push(this.props.data.regionName);
        if(this.props.data.provinceName)
            regionString.push(this.props.data.provinceName);
        if(this.props.data.cityName)
            regionString.push(this.props.data.cityName);
        if(this.props.data.districtName)
            regionString.push(this.props.data.districtName);
        return (
            <Card loading={this.props.loading}>
                <DescriptionList size="large" title={this.props.getString('BASE_INFO')}>
                    <Description term={this.props.getString('CODE')}>{this.props.data.code}</Description>
                    <Description term={this.props.getString('STATUS')}>{retailContractStatus.has(this.props.data.status) ? retailContractStatus.properties[this.props.data.status].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('PAY_STATUS')}>{retailContractPayStatus.has(this.props.data.payStatus) ? retailContractPayStatus.properties[this.props.data.payStatus].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('PRODUCT_CODE')}>{this.props.data.productCode}</Description>
                    <Description term={this.props.getString('PRODUCT_NAME')}>{this.props.data.productName}</Description>
                    <Description term={this.props.getString('VEHICLEMODE_LNAME')}>{this.props.data.vehicleModelName}</Description>
                    <Description term={this.props.getString('COLOR')}>{this.props.data.color}</Description>
                    <Description term={this.props.getString('VIN')}>{this.props.data.vin}</Description>
                    <Description term={this.props.getString('CERTIFICATE_NUMBER')}>{this.props.data.certificateNumber}</Description>
                    <Description term={this.props.getString('PRICE')}>{this.props.data.price ? formatAmount(this.props.data.price) : '0'}</Description>
                    <Description term={this.props.getString('VALUE_ADDED')}>{this.props.data.valueAdded ? formatAmount(this.props.data.valueAdded) : '0'}</Description>
                    <Description term={this.props.getString('TOTAL_AMOUNT')}>{this.props.data.totalAmount ? formatAmount(this.props.data.totalAmount) : '0'}</Description>
                    <Description term={this.props.getString('RETURN_REASON')}>{this.props.data.returnReason}</Description>
                    <Description term={this.props.getString('DEALER_NAME')}>{this.props.data.dealerName}</Description>
                </DescriptionList>
                <Divider/>
                <DescriptionList size="large" title={this.props.getString('CUSTOMER_INFO')}>
                    <Description term={this.props.getString('CUSTOMER_NAME')}>{this.props.data.customerName}</Description>
                    <Description term={this.props.getString('CELLNUMBER')}>{this.props.data.cellNumber}</Description>
                    <Description term={this.props.getString('CUSTOMER_TYPE')}>{customerType.has(this.props.data.customerType) ? customerType.properties[this.props.data.customerType].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('SEX')}>{sex.has(this.props.data.sex) ? sex.properties[this.props.data.sex].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('CREDENTIAL_TYPE')}>{credentialTypeText}</Description>
                    <Description term={this.props.getString('CREDENTIAL_NUMBER')}>{this.props.data.credentialNumber}</Description>
                    <Description term={this.props.getString('WECHAT')}>{this.props.data.weChat}</Description>
                    <Description term={this.props.getString('REGION')}>{regionString.join('/')}</Description>
                    <Description term={this.props.getString('DETAIL_ADDRESS')}>{this.props.data.detailAddress}</Description>
                    <Description term={this.props.getString('PAYMETHOD')}>{this.props.data.payMethod !== undefined && payMethod.has(this.props.data.payMethod) ? payMethod.properties[this.props.data.payMethod].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('LOAN_CHANNEL')}>{this.props.data.loanChannel !== undefined && loanChannel.has(this.props.data.loanChannel) ? loanChannel.properties[this.props.data.loanChannel].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('ADVANCE_DEPOSIT')}>{this.props.data.advanceDeposit ? formatAmount(this.props.data.advanceDeposit) : '0'}</Description>
                    <Description term={this.props.getString('CONSULTANT_NAME')}>{this.props.data.consultantName}</Description>
                    <Description term={this.props.getString('DRIVER_NAME')}>{this.props.data.driverName}</Description>
                    <Description term={this.props.getString('DRIVER_PHONENUMBER')}>{this.props.data.driverPhoneNumber}</Description>
                </DescriptionList>
            </Card>
        );
    }
}

RetailContractDetail.propTypes = {
    data: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    queryInitData: PropTypes.func.isRequired
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getDetail = selectorFactory(['page', 'domainData', 'retailContractDetail', 'data']);

const mapStateToProps = state => ({
    data: getDetail(state),
    loading: state.getIn(['page', 'domainData', 'retailContractDetail', 'isFetching']),
});

const mapDispatchToProps = dispatch => ({
    queryInitData: id => dispatch(actions.getDetail(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(RetailContractDetail));
