import React from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Row, Col, Card, Spin, Popover, Tooltip, Divider, Button, notification, Modal} from 'antd';
import {PAGE} from '../constants';
import {ADD_OR_UPDATE_INFO_TYPE} from './constants';
import SimpleSearchVehiclePanel from './SimpleSearchVehiclePanel';
import routes from './routes';
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};

const vinFormItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20}
};
class SelectVehicle extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showVehiclePanel: false,
            vehicleData: {
                isFetching: false,
                data: this.props.data && this.props.data.vin
                    ? [{vin: this.props.data.vin}] : [],
            },
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);

        this.handleSearchVehicle = this.handleSearchVehicle.bind(this);
        this.handleChangeVehicle = this.handleChangeVehicle.bind(this);

        this.handleShowVehiclePanel = this.handleShowVehiclePanel.bind(this);
    }

    handleFilterChange(value, id) {
        this.props.saveData({[id]: value});
    }

    handleShowVehiclePanel() {
        this.setState({
            showVehiclePanel: !this.state.showVehiclePanel,
        });
        this.props.clearVehicle();
    }

    handleSearchVehicle(value) {
        if(value)
            this.setState({
                showVehiclePanel: false
            });
        if(value && value.trim()) {
            const condition = {
                vin: value,
                productId: this.props.data.productId,
                pageIndex: PAGE.index,
                pageSize: PAGE.smallSize,
                sortBy: '',
                sortOrder: 'descend',
            };
            this.props.searchVehiclesForSelect(condition).then(data => {
                this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {
                    isFetching: false,
                    data,
                })});
            });
        }
    }

    handleChangeVehicle(value) {
        this.props.saveData({
            vin: value && value.key ? value.key : '',
        });
        this.setState({vehicleData: Object.assign({}, this.state.vehicleData, {data: value && value.key ? [{vin: value.key}] : []})});
    }

    submit=() => {
        this.props.submit(this.props.id).then(data => {
            if(data && data.success) {
                this.props.resetPanel();
                this.props.history.push(routes.query.url());
                this.props.refreshList();
            } else if(data && data.emptyErrors && data.emptyErrors.length > 0)
                notification.warning({
                    message: this.props.getString('NOTIFACATION_MESSAGE')
                });
        });
    }

    selectData=data => {
        this.props.selectVehicle(data);
        this.setState({
            showVehiclePanel: false
        });
    }
    render() {
        const vehicleOption = this.state.vehicleData.data.map(d => <Option key={d.vin}>{d.vin}</Option>);
        
        const popoverContent = (
            <SimpleSearchVehiclePanel
                data={this.props.vehicleDataForSimpleSearch}
                productId={this.props.data.productId}
                query={this.props.queryVehicles}
                selectData={this.selectData}/>
        );
        const selectValue = this.props.data.vin
            ? {
                key: this.props.data.vin,
                label: this.props.data.vin
            } : undefined;

        return (
            <div>
                <Card title={this.props.getString('VEHICLE_INFO')} extra={<Button type="primary" onClick={this.submit}>{this.props.getString('SUBMIT')}</Button>}>
                    <Form className="form-standard">
                        <Row gutter={8}>
                            <Col span={16}>
                                <FormItem label={<Tooltip placement="topRight" title={this.props.getString('VIN_TOOLTIP')}>
                                    <a onClick={this.handleShowVehiclePanel}>VIN</a> </Tooltip>} {...vinFormItemLayout}>
                                    <Select allowClear={true}
                                        value={selectValue}
                                        placeholder={this.props.getString('VIN_PLACEHOLDER')}
                                        notFoundContent={this.state.vehicleData.isFetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        labelInValue
                                        showSearch
                                        onSearch={this.handleSearchVehicle}
                                        onChange={this.handleChangeVehicle}>
                                        {vehicleOption}
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                this.state.showVehiclePanel &&
                                <Modal title={this.props.getString('MODAL_TITLE')} footer={null} maskClosable={false}
                                    width="30%"
                                    visible={this.state.showVehiclePanel}
                                    onCancel={this.handleShowVehiclePanel}>
                                    {popoverContent}
                                </Modal>
                            }
                        </Row>
                        <Divider/>
                        <Row>
                            <Col span={8}>
                                <FormItem label={this.props.getString('PRODUCT_CODE')} {...formItemLayout}>
                                    {this.props.data.productCode}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={this.props.getString('PRODUCT_NAME')} {...formItemLayout}>
                                    {this.props.data.productName}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={this.props.getString('VEHICLEMODEL_NAME')} {...formItemLayout}>
                                    {this.props.data.vehicleModelName}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <FormItem label={this.props.getString('COLOR')} {...formItemLayout}>
                                    {this.props.data.color}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={this.props.getString('PRICE')} {...formItemLayout}>
                                    {this.props.data.price}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={this.props.getString('CERTIFICATE_NUMBER')} {...formItemLayout}>
                                    {this.props.data.certificateNumber}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>
           
        );
    }
}

SelectVehicle.propTypes = {
    clearVehicle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    queryVehicles: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    searchVehiclesForSelect: PropTypes.func.isRequired,
    selectVehicle: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    vehicleDataForSimpleSearch: PropTypes.object.isRequired,
    id: PropTypes.string,
    resetPanel: PropTypes.func
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getAddedData = selectorFactory(['page', 'appState', 'productInfo']);
const getVehiclesForSimpleSearch = selectorFactory(['page', 'domainData', 'vehicleInventorys']);

const mapStateToProps = state => ({
    data: getAddedData(state),
    vehicleDataForSimpleSearch: getVehiclesForSimpleSearch(state),
});

const mapDispatchToProps = dispatch => ({
    queryVehicles: condition => dispatch(actions.searchVehicles(condition)),
    searchVehiclesForSelect: condition => dispatch(actions.searchVehiclesForSelect(condition)),
    selectVehicle: data => dispatch(actions.selectVehicle(data)),
    saveData: obj => dispatch(actions.saveAddData(obj, ADD_OR_UPDATE_INFO_TYPE.productInfo)),
    submit: id => dispatch(actions.matchVehicle(id)),
    resetPanel: () => dispatch(actions.resetAddPanel()),
    refreshList: () => dispatch(actions.refreshList()),
    clearVehicle: () => dispatch(actions.clearVehicle()),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(SelectVehicle));
