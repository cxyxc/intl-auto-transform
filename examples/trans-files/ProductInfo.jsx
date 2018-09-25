import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Row, Col, Card, Spin, InputNumber, Alert, Modal, Tooltip} from 'antd';
import TextInput from 'Shared/components/TextInput';
import {PAGE, FORM_ITEM_LAYOUT_OPTIONS, ROW_FORM_ITEM_LAYOUT_OPTIONS, AMOUNT_FORMATTER} from '../constants';
import styles from './style.css';
import {ADD_OR_UPDATE_INFO_TYPE} from './constants';
import SimpleProductQueryPanel from '../common/SimpleProductQueryPanel';
import SimpleVehicleQueryPanel from '../common/SimpleVehicleQueryPanel';
import {productCategoryType} from '../Enum';
import isEmpty from 'lodash/isEmpty';
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout2 = {
    ...ROW_FORM_ITEM_LAYOUT_OPTIONS
};

const formItemLayout = {
    ...FORM_ITEM_LAYOUT_OPTIONS
};

class ProductInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showProductPanel: false,
            showVehiclePanel: false,
            productData: {
                isFetching: false,
                data: this.props.selectData && this.props.selectData.productId && !isEmpty(this.props.selectData.productId)
                    ? [this.props.selectData.productId] : []
            },
            vehicleData: {
                isFetching: false,
                data: this.props.selectData && this.props.selectData.vin && !isEmpty(this.props.selectData.vin)
                    ? [this.props.selectData.vin] : [],
                data2: []
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectData.productId !== this.props.selectData.productId)
            this.setState({productData: Object.assign({}, this.state.productData,
                {data: isEmpty(nextProps.selectData.productId) ? [] : [nextProps.selectData.productId]})});
        if(nextProps.selectData.vin !== this.props.selectData.vin)
            this.setState({vehicleData: Object.assign({}, this.state.vehicleData,
                {data: isEmpty(nextProps.selectData.vin) ? [] : [nextProps.selectData.vin]})});
    }

    handleFilterChange= (value, id) => {
        this.props.saveData({[id]: value});
    }

    handleShowProductPanel=() => {
        this.setState({showProductPanel: !this.state.showProductPanel});
    }

    handleShowVehiclePanel=() => {
        this.setState({showVehiclePanel: !this.state.showVehiclePanel});
    }

    handleSearchProduct=value => {
        this.setState({productData: Object.assign({}, this.state.productData, {isFetching: true})});

        if(value && value.trim()) {
            const condition = {
                query: value,
                type: productCategoryType.产品,
                ancestorId: this.props.ancestorId,
                pageIndex: PAGE.index,
                pageSize: PAGE.smallSize,
                sortBy: '',
                sortOrder: 'descend',
            };
            this.props.searchProductsForSelect(condition).then(data => {
                const result = data.map(d => ({
                    key: d.productId,
                    label: `${d.productCode},${d.productName},${d.vehicleModelName},${d.color}`
                }));
                this.setState({productData: Object.assign({}, this.state.productData, {data: result,
                    isFetching: false})});
            });
        }
    }

    handleChangeProduct=value => {
        if(value) {
            const label = value.label.split(',');
            this.props.selectProduct({
                productId: value.key,
                productCode: label[0] ? label[0] : '',
                productName: label[1] ? label[1] : '',
                vehicleModelName: label[2] ? label[2] : '',
                color: label[3] ? label[3] : '',
                vin: ''
            });
        } else
            this.props.saveData({
                productId: '',
                vin: ''
            });
        this.setState({productData: Object.assign({}, this.state.productData, {data: value ? [value] : []})});
    }

    handleSearchVehicle=value => {
        this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {isFetching: true})});
        if(value && value.trim()) {
            const condition = {
                vin: value,
                productId: this.props.data.productId ? this.props.data.productId : null,
                pageIndex: PAGE.index,
                pageSize: PAGE.smallSize,
                sortBy: '',
                sortOrder: 'descend',
            };
            this.props.searchVehiclesForSelect(condition).then(data => {
                const result = data.map(d => ({
                    key: d.vin,
                    label: `${d.vin},${d.productName},${d.vehicleModelName},${d.color}`
                }));
         
                this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {
                    isFetching: false,
                    data: result,
                    data2: data
                })});
            });
        }
    }

    handleChangeVehicle=value => {
        if(value) {
            const products = this.state.vehicleData.data2.filter(v => v.vin === value.key);
            if(products && products[0]) {
                const product = {
                    key: products[0].productId,
                    label: `${products[0].productCode},${products[0].productName},${products[0].vehicleModelName},${products[0].color}`
                };
                this.props.saveData({
                    vin: value.key,
                    productId: products[0].productId,
                    productCode: products[0].productCode,
                    productName: products[0].productName,
                    vehicleModelName: products[0].vehicleModelName,
                    color: products[0].color,
                });
    
                this.setState({
                    productData: Object.assign({}, this.state.productData, {data: [product]}),
                    vehicleData: Object.assign({}, this.state.vehicleData, {data: [value]}),
                });
            } else {
                this.props.saveData({vin: value.key});
                this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {data: [value]})});
            }
        } else {
            this.props.saveData({vin: ''});
            this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {data: []})});
        }
    }

    handleUnitPriceBlur=value => {
        this.props.saveData({price: value});
    }
    handleProductOptionOk=data => {
        this.setState({showProductPanel: false});
        this.props.selectProduct(data);
    }
    handleVehicleOptionOk=data => {
        this.setState({showVehiclePanel: false});
        this.props.selectVehicle(data);
    }

    queryProducts=condition => {
        condition = Object.assign({}, condition, {ancestorId: this.props.ancestorId});
        this.props.queryProducts(condition);
    }
    render() {
        const productsOption = this.state.productData.data.map(d => <Option key={d.key}>{d.label}</Option>);
        const vehicleOption = this.state.vehicleData.data.map(d => <Option key={d.key}>{d.label}</Option>);
        const productAlertMessage = <Alert message={this.props.getString('PRODUCT_ALERT_MESSAGE')} type="info" />;
        const vehicleAlertMessage = <Alert message={this.props.getString('VEHICLE_ALERT_MESSAGE')} type="info" />;
        return (
            <div>
                <Card title={this.props.getString('VEHICLE_INFO')}>
                    <Form className="form-standard">
                        <Row>
                            <Col>
                                <FormItem
                                    label={<Tooltip placement="topRight" title={this.props.getString('PRODUCT_TOOLTIP')}>
                                        <a onClick={this.handleShowProductPanel}>{this.props.getString('PRODUCT')}</a>
                                    </Tooltip>}
                                    {...formItemLayout2} required>
                                    <Select
                                        allowClear={true}
                                        value={this.props.selectData.productId}
                                        placeholder={this.props.getString('PRODUCT_PLACEHOLDER')}
                                        notFoundContent={this.state.productData.isFetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        showSearch
                                        labelInValue
                                        onSearch={this.handleSearchProduct}
                                        onChange={this.handleChangeProduct}>
                                        {productsOption}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormItem label={<Tooltip placement="topRight" title={this.props.getString('VIN_TOOLTIP')}>
                                    <a onClick={this.handleShowVehiclePanel}>VIN</a> </Tooltip>} {...formItemLayout2}>
                                    <Select allowClear={true}
                                        value={this.props.selectData.vin}
                                        placeholder={this.props.getString('VIN_PLACEHOLDER')}
                                        notFoundContent={this.state.vehicleData.isFetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        showSearch
                                        labelInValue
                                        onSearch={this.handleSearchVehicle}
                                        onChange={this.handleChangeVehicle}>
                                        {vehicleOption}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={this.props.getString('PRICE')} {...formItemLayout} required>
                                    <InputNumber id="price" min={0}
                                        {...AMOUNT_FORMATTER}
                                        value={this.props.data.price} onChange={this.handleUnitPriceBlur}/>
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={this.props.getString('CERTIFICATE_NUMBER')} {...formItemLayout}>
                                    <TextInput id="certificateNumber" value={this.props.data.certificateNumber}
                                        onBlur={this.handleFilterChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                {
                    this.state.showProductPanel &&
                    <Modal title={this.props.getString('QUERY_PRODUCT')} footer={null} maskClosable={false}
                        width="65%"
                        visible={this.state.showProductPanel}
                        onCancel={this.handleShowProductPanel}>
                        <Card>
                            <SimpleProductQueryPanel alertMessage={productAlertMessage}
                                data={this.props.productForSearchPanel}
                                query={this.queryProducts}
                                selectData={this.handleProductOptionOk}
                                tableClassName={styles.cursorStyle}/>
                        </Card>
                    </Modal>
                }
                {
                    this.state.showVehiclePanel &&
                        <Modal title={this.props.selectData.productId && this.props.selectData.productId.key
                            ? `${this.props.getString('VEHICLE_STOCK')}（${this.props.getString('BELONG_PRODUCT')}：${this.props.selectData.productId.label}）` : this.props.getString('VEHICLE_STOCK')}
                        footer={null} maskClosable={false}
                        width="65%"
                        visible={this.state.showVehiclePanel}
                        onCancel={this.handleShowVehiclePanel}>
                            <Card>
                                <SimpleVehicleQueryPanel alertMessage={vehicleAlertMessage}
                                    data={this.props.vehicleForSearchPanel}
                                    productId={this.props.data.productId
                                        ? this.props.data.productId : null}
                                    query={this.props.queryVehicles}
                                    selectData={this.handleVehicleOptionOk}
                                    tableClassName={styles.cursorStyle} />
                            </Card>
                        </Modal>
                }
            </div>
           
        );
    }
}

ProductInfo.propTypes = {
    data: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    productForSearchPanel: PropTypes.object.isRequired,
    vehicleForSearchPanel: PropTypes.object.isRequired,
    queryProducts: PropTypes.func.isRequired,
    queryVehicles: PropTypes.func.isRequired,
    searchProductsForSelect: PropTypes.func.isRequired,
    searchVehiclesForSelect: PropTypes.func.isRequired,
    selectProduct: PropTypes.func.isRequired,
    selectVehicle: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    selectData: PropTypes.object.isRequired,
    ancestorId: PropTypes.string,
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {createSelector} from 'reselect';
import {localize} from './localize';

const getAddedData = selectorFactory(['page', 'appState', 'productInfo']);
const getProductsForSearchPanel = selectorFactory(['page', 'domainData', 'products']);
const getVehiclesForSearchPanel = selectorFactory(['page', 'domainData', 'vehicleInventorys']);

const getSelectedData = createSelector(state => state.getIn(['page', 'appState', 'productInfo']),
    productInfo => {
        const result = {};
        const data = productInfo ? productInfo.toJS() : productInfo;
        if(productInfo && productInfo.get('productId'))
            result.productId = {
                key: data.productId,
                label: `${data.productCode},${data.productName},${data.vehicleModelName},${data.color}`
            };
        
        if(productInfo && productInfo.get('vin'))
            result.vin = {
                key: data.vin,
                label: `${data.vin},${data.productName},${data.vehicleModelName},${data.color}`
            };
        return result;
    });

const mapStateToProps = state => ({
    selectData: getSelectedData(state),
    productForSearchPanel: getProductsForSearchPanel(state),
    vehicleForSearchPanel: getVehiclesForSearchPanel(state),
    data: getAddedData(state),
    ancestorId: state.getIn(['page', 'domainData', 'initData', 'currentUserInfo', 'brandId'])
});

const mapDispatchToProps = dispatch => ({
    queryProducts: condition => dispatch(actions.searchProducts(condition)),
    searchProductsForSelect: condition => dispatch(actions.searchProductsForSelect(condition)),
    queryVehicles: condition => dispatch(actions.searchVehicles(condition)),
    searchVehiclesForSelect: condition => dispatch(actions.searchVehiclesForSelect(condition)),
    selectProduct: data => dispatch(actions.selectProduct(data)),
    selectVehicle: data => dispatch(actions.selectVehicle(data)),
    saveData: obj => dispatch(actions.saveAddData(obj, ADD_OR_UPDATE_INFO_TYPE.productInfo)),
});
export default connect(mapStateToProps, mapDispatchToProps)(localize(ProductInfo));

