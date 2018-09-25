import React from 'react';
import PropTypes from 'prop-types';
import {Table, Card} from 'antd';
import moment from 'moment';
import {DATATIME_FORMAT, TABLE} from '../constants';

const compare = (a, b) => {
    if(a > b)
        return 1;
    if(b > a)
        return -1;
    return 0;
};
class LogList extends React.PureComponent {
    componentDidMount() {
        this.props.queryInitData(this.props.id);
    }

    render() {
        const columns = [{
            title: this.props.getString('OPERATE_TIME'),
            width: 150,
            dataIndex: 'operateTime',
            render: text => text && moment(text).isValid ? moment(text).format(DATATIME_FORMAT) : null,
            sorter: (a, b) => compare(a.operateTime, b.operateTime)
        }, {
            title: this.props.getString('OPERATOR_NAME'),
            width: 150,
            dataIndex: 'operatorName'
        }, {
            title: this.props.getString('CONTENT'),
            dataIndex: 'content',
        }];

        return (
            <Card loading={this.props.loading} title={this.props.getString('OPERATE_LOG')}>
                <Table className="white-space-nowrap"
                    columns={columns}
                    dataSource={this.props.data}
                    rowKey="id"
                    pagination={false}
                    loading={this.props.loading}
                    {...TABLE} />
            </Card>
        );
    }
}

LogList.propTypes = {
    data: PropTypes.array.isRequired,
    getString: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    queryInitData: PropTypes.func.isRequired
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getDetail = selectorFactory(['page', 'domainData', 'retailContractLogs', 'data']);

const mapStateToProps = state => ({
    data: getDetail(state),
    loading: state.getIn(['page', 'domainData', 'retailContractLogs', 'isFetching']),
});

const mapDispatchToProps = dispatch => ({
    queryInitData: id => dispatch(actions.getLogs(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(LogList));
