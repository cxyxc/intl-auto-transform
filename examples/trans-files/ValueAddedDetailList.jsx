import React from 'react';
import PropTypes from 'prop-types';
import {Table, Card} from 'antd';
import {valueAddedType, valueAddedCategory} from '../Enum';
import {conventEnumValueToString, formatAmount} from '../utils';
import {TABLE} from '../constants';
class ValueAddedDetailList extends React.PureComponent {
    componentDidMount() {
        this.props.queryInitData(this.props.id);
    }

    render() {
        const columns = [{
            title: <div>
                <span>{this.props.getString('CODE')}</span>
                <span className="ant-divider" />
                <span>{this.props.getString('NAME')}</span>
            </div>,
            dataIndex: 'productCode',
            render: (text, d) =>
                <div>
                    <span>{d.productCode}</span>
                    <span className="ant-divider" />
                    <span>{d.productName}</span>
                </div>
        }, {
            title: this.props.getString('CATEGORY'),
            dataIndex: 'category',
            render: text => conventEnumValueToString(valueAddedCategory, text, this.props.language)

        }, {
            title: this.props.getString('TYPE'),
            dataIndex: 'type',
            render: text => conventEnumValueToString(valueAddedType, text, this.props.language)
        }, {
            title: this.props.getString('ISFREE'),
            dataIndex: 'isFree',
            render: text => text ? this.props.getString('YES') : this.props.getString('NO')
        }, {
            title: this.props.getString('QUANTITY'),
            dataIndex: 'quantity',
        }, {
            title: this.props.getString('AMOUNT'),
            dataIndex: 'unitPrice',
            render: text => formatAmount(text),
        }, {
            title: this.props.getString('DISCOUNTPRICE'),
            dataIndex: 'discountPrice',
            render: text => formatAmount(text),
        }, {
            title: this.props.getString('TOTAL_AMOUNT'),
            dataIndex: 'totalAmount',
            render: text => formatAmount(text),
        }];

        return (
            <Card loading={this.props.loading} title={this.props.getString('VALUE_ADDED')}>
                <Table className="white-space-nowrap"
                    columns={columns}
                    dataSource={this.props.data}
                    rowKey="productId"
                    pagination={false}
                    loading={this.props.loading}
                    {...TABLE} />
            </Card>
        );
    }
}

ValueAddedDetailList.propTypes = {
    data: PropTypes.array.isRequired,
    getString: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    queryInitData: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getDetail = selectorFactory(['page', 'domainData', 'valueAddeds', 'data']);

const mapStateToProps = state => ({
    data: getDetail(state),
    loading: state.getIn(['page', 'domainData', 'valueAddeds', 'isFetching']),
});

const mapDispatchToProps = dispatch => ({
    queryInitData: id => dispatch(actions.getValueAddeds(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(ValueAddedDetailList));
