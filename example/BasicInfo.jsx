import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col, Modal} from 'antd';
import TextInput from 'Shared/components/TextInput';
import {FORM_OPTIONS, FORM_ROW_OPTIONS} from '../../constants';
import WrappedSelect from '../../common/WrappedSelect';
import SearchSelect from '../../common/SearchSelect';
import DealerSelectPanel from './DealerSelectPanel';

const FormItem = Form.Item;

class BasicInfo extends React.PureComponent {
    state={
        showDealerSelectPanel: false
    }

    onDealerChange = data => {
        this.props.saveDealer({
            dealerId: parseInt(data.id, 10),
            dealerCode: data.code,
            dealerName: data.name,
            isEC: data.isEC
        });
    }

    onSearchDealer = value => this.props.getSimpleDealers(value).then(res => {
        const data = res.data;
        if(data)
            data.forEach(d => {
                d.id = d.id.toString();
            });
        return data;
    })

    onCloseDealerSelectPanel = () => {
        this.setState({showDealerSelectPanel: false});
    }

    onClickSearchDealerBtn = () => {
        this.setState({showDealerSelectPanel: true});
    }

    render() {
        const validateFundsType = !this.props.data.fundsTypeId && this.props.validate ? {validateStatus: 'error'} : null;
        const fundsTypesOptions = this.props.fundsTypes.map(v => ({
            value: v.id.toString(),
            text: v.name
        }));
    
        const dealerInfo = this.props.data.dealerId ? {
            id: this.props.data.dealerId,
            code: this.props.data.dealerCode,
            name: this.props.data.dealerName
        } : null;
        return (
            <Form className="form-standard">
                <Row>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="订单编号" {...FORM_OPTIONS.item}>
                            {this.props.data.code || '尚未生成'}
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="订单总金额" {...FORM_OPTIONS.item}>
                            {this.props.totalAmount}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="资金类型" {...FORM_OPTIONS.item} required {...validateFundsType}>
                            <WrappedSelect id="fundsTypeId" options={fundsTypesOptions}
                                value={this.props.data.fundsTypeId || ''} onChange={this.props.saveData}/>
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem
                            label="经销商"
                            {...FORM_OPTIONS.item}
                            validateStatus={this.props.validate && !this.props.data.dealerId ? 'error' : null}
                            required>
                            <SearchSelect
                                value={dealerInfo}
                                disabled={this.props.disabled}
                                placeholder="请输入查询"
                                onSelect={this.onDealerChange}
                                onSearch={this.onSearchDealer}
                                keyIndex="id"
                                labelMap={d => `(${d.code}) ${d.name}`}
                                onClickSearchBtn={this.onClickSearchDealerBtn} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="备注" {...FORM_ROW_OPTIONS.item}>
                        <TextInput id="remark" value={this.props.data.remark} onBlur={this.props.saveData} />
                    </FormItem>
                </Row>
                {
                    this.state.showDealerSelectPanel &&
                    <Modal
                        title="选择经销商"
                        maskClosable={false}
                        footer={null}
                        destroyOnClose={true}
                        width="70%"
                        visible={this.state.showDealerSelectPanel}
                        onCancel={this.onCloseDealerSelectPanel}>
                        <DealerSelectPanel onCancel={this.onCloseDealerSelectPanel}/>
                    </Modal>
                }
            </Form>
        );
    }
}

BasicInfo.propTypes = {
    data: PropTypes.object.isRequired,
    getSimpleDealers: PropTypes.func.isRequired,
    saveData: PropTypes.func.isRequired,
    saveDealer: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    fundsTypes: PropTypes.array,
    totalAmount: PropTypes.number,
    validate: PropTypes.bool,
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {createSelector} from 'reselect';
import sum from 'lodash/sum';

const getAddedData = selectorFactory(['page', 'appState', 'savedBasicInfo']);
const getFundsTypes = selectorFactory(['page', 'domainData', 'initData', 'fundsTypes']);
const getTotalAmount = createSelector(state => state.getIn(['page', 'appState', 'orderDetails', 'data']), data => {
    let prices = [];
    if(data)
        prices = data.toJS().map(v => v.quantity && v.price ? v.quantity * v.price : 0);
    return prices.length > 0 ? sum(prices) : 0;
});

const mapStateToProps = state => ({
    data: getAddedData(state),
    fundsTypes: getFundsTypes(state),
    totalAmount: getTotalAmount(state)
});

const mapDispatchToProps = dispatch => ({
    saveData: (value, id) => dispatch(actions.saveBasicInfo({[id]: value})),
    saveDealer: record => dispatch(actions.changeDealer(record)),
    getSimpleDealers: con => dispatch(actions.getSimpleDealers(con))
});

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfo);
