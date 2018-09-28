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
        const {getString} = this.props;
        const {data, isFetching, message: errorMessage} = this.props.employeeInfo;
        const {pageIndex, pageSize} = this.props.condition;
        const columns = [
            {
                title: getString('dataTablePanel.username'),
                dataIndex: 'username',
                sorter: true,
                render: (text, record) => <Link to={routes.detail.format(record.userId)}>{text}</Link>
            },
            {
                title: getString('dataTablePanel.nam'),
                dataIndex: 'name',
                sorter: true
            },
            {
                title: getString('dataTablePanel.sex'),
                dataIndex: 'sex',
                render: text => conventEnumValueToString(sex, text, this.props.language)
            },
            {
                title: getString('dataTablePanel.jobDescription'),
                dataIndex: 'jobDescription'
            },
            {
                title: getString('dataTablePanel.job'),
                dataIndex: 'job',
                render: text => conventEnumValueToString(jobType, text, this.props.language)
            },
            {
                title: getString('dataTablePanel.phoneNumber'),
                dataIndex: 'phoneNumber'
            },
            {
                title: getString('dataTablePanel.address'),
                dataIndex: 'address'
            },
            {
                title: getString('dataTablePanel.idNumber'),
                dataIndex: 'idNumber'
            },
            {
                title: getString('dataTablePanel.dealerName'),
                dataIndex: 'dealerName'
            },
            {
                title: getString('dataTablePanel.status'),
                dataIndex: 'status',
                render: text => conventEnumValueToString(employeeStatus, text, this.props.language)
            }
        ];
        const fixedColumn = {
            title: getString('dataTablePanel.action'),
            dataIndex: 'userId',
            render: (text, record) => {
                const menus = [
                    {
                        id: 'update',
                        children: (
                            <Link key="update" to={routes.update.format(record.userId)}>
                                {getString('dataTablePanel.edit')}
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
    history: PropTypes.object,
    language: PropTypes.string
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
