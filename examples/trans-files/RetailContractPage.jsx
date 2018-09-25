import React from 'react';
import PropTypes from 'prop-types';
import {Divider, Table, Badge, Card} from 'antd';
import {customerType, sex, valueAddedCategory, credentialType, payMethod, loanChannel} from '../Enum';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import {formatAmount} from '../utils';
import sum from 'lodash/sum';
import {TABLE} from '../constants';

const {Description} = DescriptionList;

class RetailContractPage extends React.PureComponent {
    componentDidMount() {

    }

    render() {
        const {customerInfo, productInfo, valueAdded, consultants} = this.props;
        const consultantName = consultants.filter(v => v.userId === customerInfo.consultantId) && consultants.filter(v => v.userId === customerInfo.consultantId)[0]
            ? consultants.filter(v => v.userId === customerInfo.consultantId)[0].name : '';
        let regionString = '';
        if(customerInfo.regions && customerInfo.regions.length > 0)
            regionString = customerInfo.regions.map(r => r.name).join('/');
        else {
            const name = [];
            if(customerInfo.regionName)
                name.push(customerInfo.regionName);
            if(customerInfo.provinceName)
                name.push(customerInfo.provinceName);
            if(customerInfo.cityName)
                name.push(customerInfo.cityName);
            if(customerInfo.districtName)
                name.push(customerInfo.districtName);
            regionString = name.join('/');
        }


        const columns = [{
            title: <div>
                <span>{this.props.getString('CODE')}</span>
                <span className="ant-divider" />
                <span>{this.props.getString('NAME')}</span>
            </div>,
            dataIndex: 'code',
            render: (text, d) =>
                <div>
                    <span>{d.code}</span>
                    <span className="ant-divider" />
                    <span>{d.name}</span>
                </div>
        }, {
            title: this.props.getString('CATEGORY'),
            dataIndex: 'category',
            render: text => text && valueAddedCategory.has(text) ? valueAddedCategory.properties[text].getText(this.props.language) : null
        }, {
            title: this.props.getString('AMOUNT'),
            dataIndex: 'amount',
            render: text => formatAmount(text),
        }, {
            title: this.props.getString('ISFREE'),
            dataIndex: 'isFree',
            render: text => text ? this.props.getString('YES') : this.props.getString('NO')
        }, {
            title: this.props.getString('QUANTITY'),
            dataIndex: 'quantity',
            render: (text, record) => {
                if(text !== undefined)
                    return text;
                return <Badge status="error"/>;
            }
        }, {
            title: this.props.getString('DISCOUNTPRICE'),
            dataIndex: 'discountPrice',
            render: text => formatAmount(text),
        }, {
            title: this.props.getString('TOTAL_AMOUNT'),
            dataIndex: 'totalAmount',
            render: (text, record) => {
                if(record.isFree)
                    return formatAmount(0);
                if(record.discountPrice !== undefined)
                    return formatAmount(record.quantity * record.discountPrice);
                return formatAmount(record.quantity * record.amount);
            }
        }];

        const valueAddedAmout = sum(
            valueAdded.map(record => {
                if(record.isFree)
                    return 0;
                if(record.discountPrice !== undefined)
                    return record.quantity * record.discountPrice;
                return record.quantity * record.amount;
            }));
        const totalAmount = productInfo.price ? valueAddedAmout + productInfo.price : valueAddedAmout;

        return (
            <Card>
                <DescriptionList size="large" title={this.props.getString('CUSTOMER_INFO')}>
                    <Description term={this.props.getString('CUSTOMER_NAME')} className="fontColor">{customerInfo.customerName}</Description>
                    <Description term={this.props.getString('CELLNUMBER')} className="fontColor">{customerInfo.cellNumber}</Description>
                    <Description term={this.props.getString('CUSTOMER_TYPE')} className="fontColor">{customerType.has(customerInfo.customerType) ? customerType.properties[customerInfo.customerType].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('SEX')} className="fontColor">{sex.has(customerInfo.sex) ? sex.properties[customerInfo.sex].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('CREDENTIAL_TYPE')} className="fontColor">{credentialType.has(customerInfo.credentialType) ? credentialType.properties[customerInfo.credentialType].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('CREDENTIAL_NUMBER')} className="fontColor">{customerInfo.credentialNumber}</Description>
                    <Description term={this.props.getString('WECHAT')} className="fontColor">{regionString}</Description>
                    <Description term={this.props.getString('REGION')} className="fontColor">{customerInfo.detailAddress}</Description>
                    <Description term={this.props.getString('DETAIL_ADDRESS')}>{customerInfo.weChat}</Description>
                    <Description term={this.props.getString('PAYMETHOD')}>{payMethod.has(customerInfo.payMethod) ? payMethod.properties[customerInfo.payMethod].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('LOAN_CHANNEL')}>{loanChannel.has(customerInfo.loanChannel) ? loanChannel.properties[customerInfo.loanChannel].getText(this.props.language) : null}</Description>
                    <Description term={this.props.getString('ADVANCE_DEPOSIT')}>{customerInfo.advanceDeposit ? formatAmount(customerInfo.advanceDeposit) : '0'}</Description>
                    <Description term={this.props.getString('CONSULTANT_NAME')}>{consultantName}</Description>
                    <Description term={this.props.getString('DRIVER_NAME')}>{customerInfo.driverName}</Description>
                    <Description term={this.props.getString('DRIVER_PHONENUMBER')}>{customerInfo.driverPhoneNumber}</Description>
                </DescriptionList>
                <Divider/>
                <DescriptionList size="large" title={this.props.getString('VEHICLE_INFO')}>
                    <Description term={this.props.getString('PRODUCT_CODE')} className="fontColor">{productInfo.productCode}</Description>
                    <Description term={this.props.getString('PRODUCT_NAME')} className="fontColor">{productInfo.productName}</Description>
                    <Description term={this.props.getString('VEHICLEMODE_LNAME')}>{productInfo.vehicleModelName}</Description>
                    <Description term={this.props.getString('COLOR')}>{productInfo.color}</Description>
                    <Description term={this.props.getString('VIN')}>{productInfo.vin}</Description>
                    <Description term={this.props.getString('CERTIFICATE_NUMBER')}>{productInfo.certificateNumber}</Description>
                    <Description term={this.props.getString('PRICE')} className="fontColor">{productInfo.price ? formatAmount(productInfo.price) : '0'}</Description>
                    <Description term={this.props.getString('VALUE_ADDED_AMOUNT')} className="fontColor">{valueAddedAmout ? formatAmount(valueAddedAmout) : '0'}</Description>
                    <Description term={this.props.getString('TOTAL_AMOUNT')} className="fontColor">{totalAmount ? formatAmount(totalAmount) : '0'}</Description>
                </DescriptionList>
                <Divider/>
                <DescriptionList size="large" title={this.props.getString('VALUE_ADDED')}>
                    <Table className="white-space-nowrap"
                        columns={columns}
                        dataSource={valueAdded}
                        rowKey="id"
                        pagination={false}
                        {...TABLE}/>
                </DescriptionList>
            </Card>
        );
    }
}

RetailContractPage.propTypes = {
    consultants: PropTypes.array.isRequired,
    customerInfo: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    productInfo: PropTypes.object.isRequired,
    rtl: PropTypes.bool.isRequired,
    valueAdded: PropTypes.array.isRequired
};

import {connect} from 'react-redux';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getCustomerInfo = selectorFactory(['page', 'appState', 'customerInfo']);
const getConsultants = selectorFactory(['page', 'domainData', 'initData', 'consultants']);
const getValueAdded = selectorFactory(['page', 'appState', 'selectedValueAddedIds']);
const getProductInfo = selectorFactory(['page', 'appState', 'productInfo']);

const mapStateToProps = state => ({
    customerInfo: getCustomerInfo(state),
    consultants: getConsultants(state),
    productInfo: getProductInfo(state),
    valueAdded: getValueAdded(state)
});

export default connect(mapStateToProps, null)(localize(RetailContractPage));
