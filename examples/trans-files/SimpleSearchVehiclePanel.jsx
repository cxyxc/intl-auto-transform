import React from 'react';
import PropTypes from 'prop-types';
import {Table, Alert, Input} from 'antd';
import styles from './style.css';
import {PAGE, TABLE, PAGINATION_OPTIONS} from '../constants';

class SimpleSearchVehiclePanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            vin: '',
            pageIndex: PAGE.index,
            pageSize: PAGE.smallSize,
            sortBy: 'age',
            sortOrder: 'descend',
            productId: this.props.productId,
        };
        this.onRowClick = this.onRowClick.bind(this);
        this.onPageSizeChange = this.onPageSizeChange.bind(this);
        this.onPageIndexChange = this.onPageIndexChange.bind(this);
        this.query = this.query.bind(this);
    }

    query(value) {
        const newCondition = Object.assign({}, this.state, {
            vin: value,
            pageSize: this.state.pageSize,
            pageIndex: PAGE.index});
        this.setState({
            pageSize: this.state.pageSize,
            pageIndex: PAGE.index,
            vin: value
        });
        this.props.query(newCondition);
    }

    onRowClick(record) {
        return {
            onDoubleClick: () => this.props.selectData({vin: record.vin})
        };
    }

    onPageSizeChange(pageIndex, pageSize) {
        const newCondition = Object.assign({}, this.state, {
            pageSize,
            pageIndex: PAGE.index});
        this.setState({
            pageSize,
            pageIndex: PAGE.index
        });
        this.props.query(newCondition);
    }

    onPageIndexChange(pageIndex) {
        const newCondition = Object.assign({}, this.state, {pageIndex: pageIndex - 1});
        this.setState({
            pageIndex: pageIndex - 1,
        });
        this.props.query(newCondition);
    }

    render() {
        const columns = [{
            title: this.props.getString('VIN'),
            dataIndex: 'vin',
            width: 170,
        }, {
            title: this.props.getString('AGE'),
            dataIndex: 'age',
            width: 50,
        }, {
            title: this.props.getString('RETURN_TIMES'),
            dataIndex: 'returnTimes',
            width: 50,
        }];

        const pagination = {
            total: this.props.data.total,
            pageSize: this.state.pageSize,
            current: this.state.pageIndex + 1,
            onShowSizeChange: this.onPageSizeChange,
            onChange: this.onPageIndexChange,
            ...PAGINATION_OPTIONS
        };

        return (
            <div>
                <Input.Search placeholder="VIN" enterButton onSearch={this.query}/>
                <div className={styles.tablePanel} >
                    <Alert message={this.props.getString('ALERT_MESSAGE')} type="info" />
                    <Table className={`white-space-nowrap ${styles.cursorStyle}`}
                        columns={columns}
                        dataSource={this.props.data.data}
                        onRow={this.onRowClick}
                        rowKey="vin"
                        pagination={pagination}
                        loading={this.props.data.isFetching}
                        {...TABLE} />
                </div>
            </div>
        );
    }
}

SimpleSearchVehiclePanel.propTypes = {
    data: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        total: PropTypes.number.isRequired,
        data: PropTypes.array.isRequired,
    }).isRequired,
    getString: PropTypes.func.isRequired,
    // 参数是查询条件对象{}
    query: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    productId: PropTypes.string,
    // 参数是被选中的当前一条数据
    selectData: PropTypes.func,
};

import {localize} from './localize';

export default localize(SimpleSearchVehiclePanel);
