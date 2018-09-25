import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table, Card} from 'antd';
import {jobType, employeeStatus, sex} from '../Enum';
import {PAGINATION_OPTIONS, PAGE, TABLE, COMMON_TABLE_QUERY_FAIL_TEXT, COMMON_TABLE_EMPTY_TEXT, FIXED_COLUMN_WIDTH} from '../constants';
import {Link} from 'react-router-dom';
import DropdownMenu from 'Shared/components/DropdownMenu';
import {conventEnumValueToString, conventSorter} from '../utils';
import routes from './routes';

class DataTablePanel extends PureComponent {
    handleTableChange = (pagination, filters, sorter) => {
        const oldCondition = this.props.condition;

        if(pagination.current - 1 === oldCondition.pageIndex && pagination.pageSize === oldCondition.pageSize) {
            const condition = {
                ...conventSorter(sorter),
                pageIndex: PAGE.index
            };
            this.props.getEmployees(condition);
        }
    };

    render() {
        const {data, isFetching, message: errorMessage} = this.props.employeeInfo;
        const {pageIndex, pageSize} = this.props.condition;
        const columns = [
            {
                title: this.props.getString('USERNAME'),
                dataIndex: 'username',
                sorter: true,
                render: (text, record) => <Link to={routes.detail.format(record.userId)}>{text}</Link>
            },
            {
                title: this.props.getString('NAME'),
                dataIndex: 'name',
                sorter: true
            },
            {
                title: this.props.getString('SEX'),
                dataIndex: 'sex',
                render: text => conventEnumValueToString(sex, text)
            },
            {
                title: this.props.getString('JOB_DESCRIPTION'),
                dataIndex: 'jobDescription'
            },
            {
                title: this.props.getString('JOB'),
                dataIndex: 'job',
                render: text => conventEnumValueToString(jobType, text)
            },
            {
                title: this.props.getString('PHONE_NUMBER'),
                dataIndex: 'phoneNumber'
            },
            {
                title: this.props.getString('ADDRESS'),
                dataIndex: 'address'
            },
            {
                title: this.props.getString('ID_NUMBER'),
                dataIndex: 'idNumber'
            },
            {
                title: this.props.getString('DEALER_NAME'),
                dataIndex: 'dealerName'
            },
            {
                title: this.props.getString('STATUS'),
                dataIndex: 'status',
                render: text => conventEnumValueToString(employeeStatus, text)
            }
        ];
        const fixedColumn = {
            title: this.props.getString('ACTION'),
            dataIndex: 'userId',
            render: (text, record) => {
                const menus = [
                    {
                        id: 'update',
                        children: (
                            <Link key="update" to={routes.update.format(record.userId)}>
                                {this.props.getString('EDIT')}
                            </Link>
                        ),
                        primary: true,
                        hidden: !(this.props.editable && record.options && record.options.includes('update'))
                    }
                ];
                return <DropdownMenu key={text} id={text} menus={menus} />;
            },
            width: FIXED_COLUMN_WIDTH,
            fixed: 'right'
        };
        if(this.props.hasDataPremission) columns.push(fixedColumn);
        const pagination = {
            total: data.totalElements,
            current: pageIndex + 1,
            pageSize,
            onShowSizeChange: (current, pageSize) => {
                const options = {
                    pageIndex: PAGE.index,
                    pageSize
                };
                this.props.getEmployees(options);
            },
            onChange: current => {
                const options = {
                    pageIndex: current - 1
                };
                this.props.getEmployees(options);
            },
            ...PAGINATION_OPTIONS
        };
        return (
            <Card>
                <Table
                    className="white-space-nowrap"
                    rowKey="userId"
                    dataSource={data.content}
                    columns={columns}
                    loading={isFetching}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                    {...TABLE}
                    locale={{
                        emptyText: errorMessage ? COMMON_TABLE_QUERY_FAIL_TEXT : COMMON_TABLE_EMPTY_TEXT
                    }}/>
            </Card>
        );
    }
}

DataTablePanel.propTypes = {
    condition: PropTypes.object.isRequired,
    editable: PropTypes.bool.isRequired,
    employeeInfo: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
    getEmployees: PropTypes.func,
    hasDataPremission: PropTypes.bool,
    history: PropTypes.object
};
import {connect} from 'react-redux';
import * as actions from './actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import Immutable from 'immutable';
import {localize} from './localize';
const getData = selectorFactory(['page', 'domainData', 'employees']);
const getCondition = selectorFactory(['page', 'appState', 'queryCondition']);

const mapStateToProps = state => {
    const permissions = state.getIn(['page', 'domainData', 'permissions', 'data']).toSet();
    const dataOptions = Immutable.Set(['update']);
    const hasDataPremission = permissions.intersect(dataOptions).size > 0;
    return {
        employeeInfo: getData(state),
        condition: getCondition(state),
        hasDataPremission,
        editable: permissions.includes('update')
    };
};

const mapDispatchToProps = dispatch => ({
    getEmployees: options => dispatch(actions.onClickPageBtn(options))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(localize(DataTablePanel));
