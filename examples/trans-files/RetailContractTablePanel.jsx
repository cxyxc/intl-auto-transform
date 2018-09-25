import React from 'react';
import {Table, Modal, notification} from 'antd';
import PropTypes from 'prop-types';
import {retailContractPayStatus, retailContractStatus} from '../Enum';
import routes from './routes';
import moment from 'moment';
import {DATA_FORMAT, PAGINATION_OPTIONS, TABLE, FIXED_COLUMN_WIDTH} from '../constants';
import {RETAIL_CONTRACT_PERMISSION} from './constants';
import {conventEnumValueToString, formatAmount} from '../utils';
import DropdownMenu from 'Shared/components/DropdownMenu';
import ReturnVehiclePanel from './ReturnVehiclePanel';
const confirm = Modal.confirm;

export class RetailContractTablePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPanel: false,
            currentId: 0,
            isOperatting: false
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleOptionCancel = this.handleOptionCancel.bind(this);
        this.handleOptionOk = this.handleOptionOk.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.hasPermission = this.hasPermission.bind(this);
        this.handleTableOnChange = this.handleTableOnChange.bind(this);
    }

    handleFilterChange(value, id) {
        this.setState({returnReason: value});
    }

    handleOptionCancel() {
        this.setState({showPanel: false});
    }

    handleOptionOk(reason) {
        if(!reason) {
            notification.error({
                message: this.props.getString('NOTIFACTION_MESSAGE')
            });
            return;
        }

        this.setState({showPanel: false});
        this.props.returnVehicle(this.state.currentId, reason).then(isOk => {
            if(isOk)
                this.props.refreshList();
        });
    }

    handleMenuClick(name, {id}) {
        switch(name) {
            case RETAIL_CONTRACT_PERMISSION.update:
                this.props.history.push(routes.update.format(id));
                break;
            case RETAIL_CONTRACT_PERMISSION.matchVehicle:
                this.props.history.push(routes.matchVehicle.format(id));
                break;
            case RETAIL_CONTRACT_PERMISSION.returnVehicle:
                this.setState({
                    showPanel: true,
                    currentId: id
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.pay:
                confirm({
                    title: this.props.getString('PAY_TITLE'),
                    content: this.props.getString('PAY_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.pay(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.cancelPickUp:
                confirm({
                    title: this.props.getString('CANCELPICKUP_TITLE'),
                    content: this.props.getString('CANCELPICKUP_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.cancelPickUp(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.cancelSettle:
                confirm({
                    title: this.props.getString('CANCELSETTLE_TITLE'),
                    content: this.props.getString('CANCELSETTLE_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.cancelSettle(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.cancelOrder:
                confirm({
                    title: this.props.getString('CANCELORDER_TITLE'),
                    content: this.props.getString('CANCELORDER_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.cancelOrder(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.pickUp:
                confirm({
                    title: this.props.getString('PICKUP_TITLE'),
                    content: this.props.getString('PICKUP_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.pickUp(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.settle:
                confirm({
                    title: this.props.getString('SETTLE_TITLE'),
                    content: this.props.getString('SETTLE_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.settle(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    }
                });
                break;
            case RETAIL_CONTRACT_PERMISSION.issueReceipt:
                confirm({
                    title: this.props.getString('ISSUERECEIPT_TITLE'),
                    content: this.props.getString('ISSUERECEIPT_CONTENT'),
                    okText: this.props.getString('OKTEXT'),
                    cancelText: this.props.getString('CANCELTEXT'),
                    onOk: () => {
                        this.setState({isOperatting: true});
                        this.props.issueReceipt(id).then(isOk => {
                            this.setState({isOperatting: false});
                            if(isOk)
                                this.props.refreshList();
                        });
                    },
                });
                break;
        }
    }

    hasPermission(option) {
        return this.props.permissions.some(item => item === option);
    }

    handleDetail = e => {
        this.props.history.push(routes.detail.format(e.target.dataset.recordId));
    }

    handleTableOnChange(pagination, filters, sorter) {
        if(pagination.current - 1 === this.props.pageIndex && pagination.pageSize === this.props.pageSize)
            this.props.onConditionsChange({
                sortBy: sorter.field,
                sortOrder: sorter.order,
            });
    }

    render() {
        const columns = [{
            title: this.props.getString('CODE'),
            dataIndex: 'code',
            width: '200px',
            sorter: true,
            render: (text, record) => <a data-record-id={record.id} onClick={this.handleDetail}>{text}</a>
        }, {
            title: this.props.getString('CUSTOMERNAME'),
            dataIndex: 'customerName'
        }, {
            title: this.props.getString('CELLNUMBER'),
            dataIndex: 'cellNumber',
        }, {
            title: this.props.getString('VEHICLEMODELNAME'),
            dataIndex: 'vehicleModelName',
        }, {
            title: this.props.getString('CONSULTANTNAME'),
            dataIndex: 'consultantName',
        }, {
            title: this.props.getString('VIN'),
            dataIndex: 'vin',
            width: 150
        }, {
            title: this.props.getString('STATUS'),
            dataIndex: 'status',
            render: text => conventEnumValueToString(retailContractStatus, text, this.props.language),
        }, {
            title: this.props.getString('PAYSTATUS'),
            dataIndex: 'payStatus',
            render: text => conventEnumValueToString(retailContractPayStatus, text, this.props.language),

        }, {
            title: this.props.getString('TOTALAMOUNT'),
            dataIndex: 'totalAmount',
            render: text => formatAmount(text),
            sorter: true,
        }, {
            title: this.props.getString('CREATETIME'),
            dataIndex: 'createTime',
            sorter: true,
            render: text => text && moment(text).isValid ? moment(text).format(DATA_FORMAT) : null
        }];
        if(this.props.permissions.some(item => item !== RETAIL_CONTRACT_PERMISSION.add))
            columns.push({
                title: this.props.getString('ACTION'),
                dataIndex: 'id',
                key: 'id',
                width: FIXED_COLUMN_WIDTH,
                fixed: 'right',
                render: (text, record) => {
                    const menus = [{
                        id: RETAIL_CONTRACT_PERMISSION.update,
                        children: this.props.getString('UPDATE'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.update) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.update)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.matchVehicle,
                        children: this.props.getString('MATCHVEHICLE'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.matchVehicle) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.matchVehicle)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.pickUp,
                        children: this.props.getString('PICKUP'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.pickUp) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.pickUp)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.cancelPickUp,
                        children: this.props.getString('CANCELPICKUP'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.cancelPickUp) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.cancelPickUp)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.pay,
                        children: this.props.getString('PAY'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.pay) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.pay)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.issueReceipt,
                        children: this.props.getString('ISSUERECEIPT'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.issueReceipt) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.issueReceipt)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.settle,
                        children: this.props.getString('SETTLE'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.settle) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.settle)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.cancelSettle,
                        children: this.props.getString('CANCELSETTLE'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.cancelSettle) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.cancelSettle)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.cancelOrder,
                        children: this.props.getString('CANCELORDER'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.cancelOrder) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.cancelOrder)),
                        onClick: this.handleMenuClick
                    }, {
                        id: RETAIL_CONTRACT_PERMISSION.returnVehicle,
                        children: this.props.getString('RETURNVEHICLE'),
                        hidden: !(record.options &&
                            record.options.some(item => item === RETAIL_CONTRACT_PERMISSION.returnVehicle) &&
                            this.hasPermission(RETAIL_CONTRACT_PERMISSION.returnVehicle)),
                        onClick: this.handleMenuClick
                    }];
                    return <DropdownMenu key={text} menus={menus} id={text} />;
                }
            });

        const pagination = {
            total: this.props.total,
            pageSize: this.props.pageSize,
            current: this.props.pageIndex + 1,
            onShowSizeChange: this.props.onPageSizeChange,
            onChange: this.props.onPageIndexChange,
            ...PAGINATION_OPTIONS
        };

        return (
            <div>
                {this.state.showPanel &&
                    <Modal title={this.props.getString('MODAL_TITLE')} footer={null} maskClosable={false} visible={this.state.showPanel} onCancel={this.handleOptionCancel}>
                        <ReturnVehiclePanel onOK={this.handleOptionOk} onCancel={this.handleOptionCancel} />
                    </Modal>}
                <Table
                    className="white-space-nowrap"
                    columns={columns}
                    dataSource={this.props.data}
                    onChange={this.handleTableOnChange}
                    rowKey="id"
                    pagination={pagination}
                    loading={this.props.loading || this.state.isOperatting}
                    {...TABLE} />
            </div>
        );
    }
}

RetailContractTablePanel.propTypes = {
    cancelOrder: PropTypes.func.isRequired,
    cancelPickUp: PropTypes.func.isRequired,
    cancelSettle: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    getString: PropTypes.func.isRequired,
    issueReceipt: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    pay: PropTypes.func.isRequired,
    permissions: PropTypes.array.isRequired,
    pickUp: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired,
    returnVehicle: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    settle: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    onConditionsChange: PropTypes.func.isRequired,
    onPageIndexChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    history: PropTypes.object,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
};

import {connect} from 'react-redux';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import * as actions from './actions';
import {localize} from './localize';

const getData = selectorFactory(['page', 'domainData', 'retailContracts', 'data']);
const getPermissions = selectorFactory(['page', 'domainData', 'initData', 'permissions']);

const mapStateToProps = state => ({
    data: getData(state),
    loading: state.getIn(['page', 'domainData', 'retailContracts', 'isFetching']),
    total: state.getIn(['page', 'domainData', 'retailContracts', 'total']),
    pageIndex: state.getIn(['page', 'appState', 'pageQueryCondition', 'pageIndex']),
    pageSize: state.getIn(['page', 'appState', 'pageQueryCondition', 'pageSize']),
    permissions: getPermissions(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    refreshList: () => dispatch(actions.refreshList()),
    onPageSizeChange: (pageIndex, pageSize) => dispatch(actions.onPageSizeChangeForGetList(pageSize)),
    onPageIndexChange: pageIndex => dispatch(actions.onPageChangeForGetList(pageIndex - 1)),
    pay: id => dispatch(actions.pay(id)),
    cancelPickUp: id => dispatch(actions.cancelPickUp(id)),
    cancelSettle: id => dispatch(actions.cancelSettle(id)),
    cancelOrder: id => dispatch(actions.cancelOrder(id)),
    returnVehicle: (id, reason) => dispatch(actions.returnVehicle(id, reason)),
    pickUp: id => dispatch(actions.pickUp(id)),
    settle: id => dispatch(actions.settle(id)),
    issueReceipt: id => dispatch(actions.issueReceipt(id)),
    onConditionsChange: obj => dispatch(actions.searchList(obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(RetailContractTablePanel));
