import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Row, Col} from 'antd';
import TextInput from 'Shared/components/TextInput';
import {retailContractPayStatus, retailContractStatus} from '../Enum';
import DateRangePicker from 'Shared/components/DateRangePicker';
import {RETAIL_CONTRACT_PERMISSION} from './constants';
import {FORM_OPTIONS, FORM_ROW_OPTIONS, FORM_BIG_OPTIONS} from '../constants';
import routes from './routes';
import TagSelect from 'Shared/components/TagSelect';
const FormItem = Form.Item;
import styles from './style.css';
class RetailContractQueryPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
    }
    componentDidMount() {
        this.props.queryInitData();
    }

    handleFilterChange(value, id) {
        this.props.onConditionsChange({[id]: value});
    }

    handleAddClick() {
        this.props.history.push(routes.add.url());
    }
    render() {
        const statusOptions = retailContractStatus.map(state => ({
            value: state.value.toString(),
            text: state.text
        }), this.props.language);
        const payStatusOptions = retailContractPayStatus.map(state => ({
            value: state.value.toString(),
            text: state.text
        }), this.props.language);
        const consultantOptions = this.props.consultants.map(con => ({
            value: con.userId,
            text: con.name
        }));
        
        const operations = [];
        const hasPermission = option => this.props.permissions.some(item => item === option);

        if(hasPermission(RETAIL_CONTRACT_PERMISSION.add))
            operations.push(<a key={RETAIL_CONTRACT_PERMISSION.add} onClick={this.handleAddClick}>{this.props.getString('ADD')}</a>);

        return (
            <Form className="form-standard">
                <Row>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={this.props.getString('CUSTOMER_NAME')} {...FORM_OPTIONS.item}>
                            <TextInput id="customerName" value={this.props.conditions.customerName} onBlur={this.handleFilterChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={this.props.getString('CELLNUMBER')} {...FORM_OPTIONS.item}>
                            <TextInput id="cellNumber" value={this.props.conditions.cellNumber} onBlur={this.handleFilterChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={this.props.getString('VIN')} {...FORM_OPTIONS.item}>
                            <TextInput id="vin" value={this.props.conditions.vin} onBlur={this.handleFilterChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={this.props.getString('CREATE_TIME')} {...FORM_OPTIONS.item}>
                            <DateRangePicker
                                id="createTime"
                                value={this.props.conditions.createTime}
                                onChange={this.handleFilterChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label={this.props.getString('CONSULTANT_NAME')} {...FORM_ROW_OPTIONS.item}>
                        <TagSelect name="consultants"
                            onChange={this.handleFilterChange}
                            value={this.props.conditions.consultants}
                            options={consultantOptions}/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={this.props.getString('STATUS')} {...FORM_ROW_OPTIONS.item}>
                        <TagSelect name="status"
                            onChange={this.handleFilterChange}
                            value={this.props.conditions.status}
                            options={statusOptions}/>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label={this.props.getString('PAY_STATUS')} {...FORM_ROW_OPTIONS.item}>
                        <TagSelect name="payStatus"
                            onChange={this.handleFilterChange}
                            value={this.props.conditions.payStatus}
                            options={payStatusOptions}/>
                    </FormItem>
                </Row>
                <Row className="operation-buttons">
                    <Col span={8}>
                        <Button key="query" type="primary" onClick={this.props.searchList} loading={this.props.loading}>{this.props.getString('QUERY')}</Button>
                        <a key="clear" className={this.props.rtl ? styles.marginRight : ''} onClick={this.props.onResetClick}>{this.props.getString('RESET')}</a>
                    </Col>
                    <Col span={16} className={this.props.rtl ? styles.rtlTextLeft : 'col-align-right'}>{operations}</Col>
                </Row>
            </Form>
        );
    }
}

RetailContractQueryPanel.propTypes = {
    conditions: PropTypes.object.isRequired,
    consultants: PropTypes.array.isRequired,
    getString: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    permissions: PropTypes.array.isRequired,
    queryInitData: PropTypes.func.isRequired,
    rtl: PropTypes.bool.isRequired,
    searchList: PropTypes.func.isRequired,
    onConditionsChange: PropTypes.func.isRequired,
    onResetClick: PropTypes.func.isRequired
};

import {connect} from 'react-redux';
import * as actions from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';


const getConditions = selectorFactory(['page', 'appState', 'queryCondition']);
const getPermissions = selectorFactory(['page', 'domainData', 'initData', 'permissions']);
const getConsultants = selectorFactory(['page', 'domainData', 'initData', 'consultants']);

const mapStateToProps = state => ({
    permissions: getPermissions(state),
    conditions: getConditions(state),
    consultants: getConsultants(state),
    loading: state.getIn(['page', 'domainData', 'retailContracts', 'isFetching']),
});

const mapDispatchToProps = dispatch => ({
    onConditionsChange: obj => dispatch(actions.saveQueryCondition(obj)),
    searchList: () => dispatch(actions.searchList()),
    queryInitData: () => dispatch(actions.getInitData()),
    onResetClick: () => dispatch(actions.resetQueryPanel()),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(RetailContractQueryPanel));
