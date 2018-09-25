import React from 'react';
import PropTypes from 'prop-types';
import {Form, Row, Col} from 'antd';
import {formatAmount} from '../utils';
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16}
};


const SummaryAmountPanel = props => (
    <Form className="form-standard">
        <Row>
            <Col span={8}>
                <FormItem label={props.getString('VALUEADDEDS_AMOUNT')} {...formItemLayout}>
                    <span className="value-font">{formatAmount(props.amount.valueAddedsAmount)}</span>
                </FormItem>
            </Col>
            <Col span={8}>
                <FormItem label={props.getString('TOTALAMOUNT')} {...formItemLayout}>
                    <span className="value-font">{formatAmount(props.amount.totalAmount)}</span>
                </FormItem>
            </Col>
        </Row>
    </Form>
);


SummaryAmountPanel.propTypes = {
    amount: PropTypes.object.isRequired,
    getString: PropTypes.func.isRequired,
};

import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {localize} from './localize';

const getAmount = createSelector(state => state.getIn(['page', 'appState', 'productInfo', 'price']),
    state => state.getIn(['page', 'domainData', 'valueAddeds', 'data']), (price, valueAddeds) => {
        if(valueAddeds) {
            let valueAddedsAmount = 0;
            valueAddeds.toJS().forEach(element => {
                valueAddedsAmount += element.totalAmount;
            });
            return {
                valueAddedsAmount,
                totalAmount: price ? price + valueAddedsAmount : valueAddedsAmount
            };
        }
    });

const mapStateToProps = state => ({
    amount: getAmount(state),
});

export default connect(mapStateToProps, null)(localize(SummaryAmountPanel));
