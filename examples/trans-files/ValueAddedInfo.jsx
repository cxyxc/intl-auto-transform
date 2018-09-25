import React from 'react';
import {Table, InputNumber, Switch, Icon, Alert} from 'antd';
import PropTypes from 'prop-types';
import {valueAddedCategory} from '../Enum';
import {formatAmount} from '../utils';
import {AMOUNT_FORMATTER, TABLE} from '../constants';
class EditInputNumber extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value !== this.props.value)
            this.setState({value: nextProps.value});
    }

    onChange(value) {
        this.setState({value});
    }

    onBlur(e) {
        const value = AMOUNT_FORMATTER.parser(e.target.value);
        this.props.onBlur({
            id: this.props.recordId,
            [this.props.name]: value ? Number(value) : this.props.defaultValue
        });
    }

    render() {
        const {recordId, onBlur, ...other} = this.props;
        return (
            <InputNumber {...other}
                value={this.state.value} onChange={this.onChange} onBlur={this.onBlur}/>
        );
    }
}

EditInputNumber.propTypes = {
    min: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    recordId: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    defaultValue: PropTypes.number,
    value: PropTypes.number,
};

export class ValueAddedInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickDeleteAll = this.onClickDeleteAll.bind(this);
        this.handleDiscountPriceChange = this.handleDiscountPriceChange.bind(this);
    }

    handleDiscountPriceChange(obj) {
        this.props.updateValueAdded({
            id: obj.id,
            discountPrice: obj.discountPrice,
            isFree: obj.discountPrice === 0
        });
    }

    onClickDelete(e) {
        this.props.removeValueAdded(e.currentTarget.dataset.recordId);
    }

    onClickDeleteAll() {
        this.props.removeValueAdded();
    }

    render() {
        const disabled = this.props.disabled;
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
            render: (text, record) => {
                if(disabled)
                    return text ? this.props.getString('YES') : this.props.getString('NO');
                return (<Switch checked={text} onChange={value => this.props.updateValueAdded({
                    id: record.id,
                    isFree: value,
                    discountPrice: undefined
                })}/>);
            }
        }, {
            title: this.props.getString('QUANTITY'),
            dataIndex: 'quantity',
            render: (text, record) => {
                if(disabled)
                    return text;
                return (
                    <EditInputNumber min={1} defaultValue={1} name="quantity" recordId={record.id}
                        value={text} onBlur={this.props.updateValueAdded}/>
                );
            }
        }, {
            title: this.props.getString('DISCOUNTPRICE'),
            dataIndex: 'discountPrice',
            render: (text, record) => {
                if(disabled)
                    return formatAmount(text);
                return (
                    <EditInputNumber name="discountPrice" min={0} recordId={record.id}
                        {...AMOUNT_FORMATTER} disabled={record.isFree}
                        value={text} onBlur={this.handleDiscountPriceChange}/>
                );
            }
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

        if(!disabled)
            columns.push({
                title: <a onClick={this.onClickDeleteAll}><Icon type="close"/></a>,
                dataIndex: 'options',
                width: 60,
                className: 'align-center',
                render: (text, record) => <a data-record-id={record.id} onClick={this.onClickDelete}><Icon type="close"/></a>
            });

        return (
            <div>{
                !disabled &&
                <Alert message={<span>{this.props.getString('ALTER_MESSAGE_1')}<Icon type="close"/>{this.props.getString('ALTER_MESSAGE_2')}</span>} type="info" />
            }
            <Table className="white-space-nowrap"
                columns={columns}
                dataSource={this.props.data}
                rowKey="id"
                pagination={false}
                {...TABLE} />
            </div>
        );
    }
}

ValueAddedInfo.propTypes = {
    data: PropTypes.array.isRequired,
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    removeValueAdded: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    updateValueAdded: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

ValueAddedInfo.defaultOption = {
    disabled: false
};
import {connect} from 'react-redux';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import * as actions from './actions';
import {localize} from './localize';

const getData = selectorFactory(['page', 'appState', 'selectedValueAddedIds']);

const mapStateToProps = state => ({
    data: getData(state)
});

const mapDispatchToProps = dispatch => ({
    updateValueAdded: obj => dispatch(actions.updateValueAdded(obj)),
    removeValueAdded: id => dispatch(actions.removeValueAdded(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(ValueAddedInfo));
