import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Form, Card, Button, Row, Col} from 'antd';
import DateRangePicker from 'Shared/components/DateRangePicker';
import TextInput from 'Shared/components/TextInput';
import moment from 'moment';
import {employeeStatus, jobType} from '../Enum';
import {FORM_OPTIONS, DATA_FORMAT, FORM_ROW_OPTIONS} from '../constants';
import {Link} from 'react-router-dom';
import styles from './style.css';
import routes from './routes';
import TagSelect from 'Shared/components/TagSelect';
import WrappedSelect from '../common/WrappedSelect';

const FormItem = Form.Item;
const emptyArray = [];

class QueryPanel extends PureComponent {
    onChange = (value, name) => {
        this.props.onChange(name, value);
    }
    onQuery = () => {
        this.props.onQuery();
    }
    render() {
        const {getString} = this.props;
        const {name, username, createTime, status, job, phoneNumber} = this.props.condition;
        const createTimeArray = createTime && Array.isArray(createTime) && createTime.length > 1
            ? createTime.map(date => moment(date))
            : emptyArray;
        return (
            <Card className="form-standard">
                <Row>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={getString('USERNAME')} {...FORM_OPTIONS.item}>
                            <TextInput name="username" value={username} onChange={this.onChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={getString('NAME')} {...FORM_OPTIONS.item}>
                            <TextInput name="name" value={name} onChange={this.onChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={getString('PHONE_NUMBER')} {...FORM_OPTIONS.item}>
                            <TextInput name="phoneNumber" value={phoneNumber} onChange={this.onChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={getString('CREATE_TIME')} {...FORM_OPTIONS.item}>
                            <DateRangePicker
                                name="createTime"
                                format={DATA_FORMAT}
                                value={createTimeArray}
                                onChange={this.onChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label={getString('STATUS')} {...FORM_OPTIONS.item}>
                            <WrappedSelect
                                name="status"
                                value={status}
                                allowClear
                                onChange={this.onChange}
                                options={employeeStatus.toList()} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label={getString('JOB')} {...FORM_ROW_OPTIONS.item}>
                        <TagSelect
                            name="job"
                            value={job}
                            options={jobType.toList()}
                            onChange={this.onChange} />
                    </FormItem>
                </Row>
                <Row>
                    <Button type="primary" onClick={this.onQuery}>{getString('QUERY')}</Button>
                    <Button onClick={this.props.resetCondition}>{getString('RESET')}</Button>
                    {
                        this.props.canUpdateRelation &&
                        <Link className={styles.right} to={routes.updateRelation.url()}>{getString('EDIT_PERSONNEL_RELATIONSHIP')}</Link>
                    }
                </Row>
            </Card>
        );
    }
}

QueryPanel.propTypes = {
    getString: PropTypes.func.isRequired,
    canUpdateRelation: PropTypes.bool,
    condition: PropTypes.object,
    resetCondition: PropTypes.func,
    onChange: PropTypes.func,
    onQuery: PropTypes.func
};

import {connect} from 'react-redux';
import * as actions from './actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';

const getCondition = selectorFactory(['page', 'uiState', 'queryPanel']);
const mapStateToProps = state => ({
    condition: getCondition(state),
    canUpdateRelation: state.getIn(['page', 'domainData', 'permissions', 'data']).includes('updateRelation')
});
const mapDispatchToProps = dispatch => ({
    onChange: (name, value) => dispatch(actions.modifyQueryCondition(name, value)),
    onQuery: () => dispatch(actions.onClickSearchEmployeeBtn()),
    resetCondition: () => dispatch(actions.restQueryCondition())
});
export default connect(mapStateToProps, mapDispatchToProps)(localize(QueryPanel));
