import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Card, Form, Row, Col, Spin, Button} from 'antd';
import TextInput from 'Shared/components/TextInput';
import WrappedSelect from '../common/WrappedSelect';
import WrappedDatePicker from '../common/WrappedDatePicker';
import {sex, educationType, politicalType, jobType} from '../Enum';
import {DATA_FORMAT, PAGE} from '../constants';
import ImageUpload from './ImageUpload';
import styles from './style.css';
import routes from './routes';
const FormItem = Form.Item;
const rowOption = {
    gutter: 16
};
const colOption = {
    span: 8
};
const formItemOption = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    },
    colon: true
};

class EditPage extends PureComponent {
    componentDidMount() {
        this.props.init();
    }

    handleImageUpload = fileInfo => {
        this.props.onChange('photoId', fileInfo.id);
    };
    onChange = (value, name) => {
        this.props.onChange(name, value);
    };
    onOk = () => {
        this.props.onSubmit().then(isOk => {
            if(isOk) this.onCancel();
        });
    };
    onCancel = () => {
        this.props.history.push(routes.query.url());
        this.props.onClose();
    };

    render() {
        const {getString, employeeInfo: data} = this.props;
        const dealerOptions = this.props.dealers.map(d => ({
            text: d.name,
            value: d.id
        }));
        let defaultDealerOption = null;
        if(data.dealerId && data.dealerName)
            defaultDealerOption = {
                text: data.dealerName,
                value: data.dealerId
            };
        /*eslint-disable eqeqeq */

        const submitable = this.props.submitable;
        return (
            <div className="form-standard">
                <Spin spinning={this.props.isFetching}>
                    <Card title={getString('BASIC_INFORMATION')} className={styles.card_margin}>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('USERNAME')} {...formItemOption}>
                                    <TextInput name="username" value={data.username} onChange={this.onChange} disabled />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('NAME')} {...formItemOption}>
                                    <TextInput name="name" value={data.name} onChange={this.onChange} disabled />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('SEX')} {...formItemOption} required>
                                    <WrappedSelect name="sex" value={data.sex} options={sex.toList()} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('JOB')} {...formItemOption} required>
                                    <WrappedSelect name="job" value={data.job} options={jobType.toList()} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('DEALER')} {...formItemOption} required>
                                    <WrappedSelect
                                        name="dealerId"
                                        value={data.dealerId}
                                        defaultOption={defaultDealerOption}
                                        onFocus={this.props.getDealers}
                                        options={dealerOptions}
                                        onChange={this.onChange}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('JOB_DESCRIPTION')} {...formItemOption}>
                                    <TextInput name="jobDescription" type="textarea" value={data.jobDescription} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('REMARK')} {...formItemOption}>
                                    <TextInput name="remark" type="textarea" value={data.remark} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={getString('PERSONNEL_INFORMATION')} className={styles.card_margin}>
                        <Row>
                            <Col {...colOption}>
                                <FormItem label={getString('PHOTO')} {...formItemOption}>
                                    <ImageUpload fileId={data.photoId} onChange={this.handleImageUpload} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('NATIONALITY')} {...formItemOption}>
                                    <TextInput name="nationality" value={data.nationality} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('ID_NUMBER')} {...formItemOption}>
                                    <TextInput name="idNumber" value={data.idNumber} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('BIRTHDAY')} {...formItemOption}>
                                    <WrappedDatePicker
                                        name="birthday"
                                        format={DATA_FORMAT}
                                        value={data.birthday}
                                        onChange={this.onChange}
                                        getCalendarContainer={trigger => trigger.parentNode}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('EDUCATION')} {...formItemOption}>
                                    <WrappedSelect
                                        name="education"
                                        value={data.education}
                                        options={educationType.toList()}
                                        onChange={this.onChange}/>
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('ETHNIC')} {...formItemOption}>
                                    <TextInput name="ethnic" value={data.ethnic} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('POLITICAL')} {...formItemOption}>
                                    <WrappedSelect
                                        name="political"
                                        value={data.political}
                                        options={politicalType.toList()}
                                        onChange={this.onChange}/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('CELL_NUMBER')} {...formItemOption}>
                                    <TextInput name="cellNumber" value={data.cellNumber} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('PHONE_NUMBER')} {...formItemOption}>
                                    <TextInput name="phoneNumber" value={data.phoneNumber} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                            <Col {...colOption}>
                                <FormItem label={getString('EMAIL')} {...formItemOption}>
                                    <TextInput name="email" value={data.email} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row {...rowOption}>
                            <Col {...colOption}>
                                <FormItem label={getString('ADDRESS')} {...formItemOption}>
                                    <TextInput name="address" value={data.address} onChange={this.onChange} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card className={`${styles.card_margin} ${styles.optionBtn}`}>
                        <Button type="primary" disabled={!submitable} loading={this.props.submitInfo.isFetching} onClick={this.onOk}>
                            {getString('SUBMIT')}
                        </Button>
                    </Card>
                </Spin>
                <div className="page-toolbar">
                    <Button type="primary" onClick={this.onCancel}>
                        {getString('RETURN')}
                    </Button>
                </div>
            </div>
        );
    }
}

EditPage.propTypes = {
    getString: PropTypes.func.isRequired,
    dealers: PropTypes.array,
    employeeInfo: PropTypes.object,
    getDealers: PropTypes.func,
    history: PropTypes.object,
    id: PropTypes.string,
    init: PropTypes.func,
    isFetching: PropTypes.bool,
    submitInfo: PropTypes.object,
    submitable: PropTypes.bool,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
};
import {connect} from 'react-redux';
import * as actions from './actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';
const getEmployeeInfo = selectorFactory(['page', 'appState', 'editInfo']);
const getDealers = selectorFactory(['page', 'domainData', 'dealers', 'data']);
const getSubmitInfo = selectorFactory(['page', 'domainData', 'submitEditInfo']);

const mapStateToProps = state => ({
    employeeInfo: getEmployeeInfo(state),
    dealers: getDealers(state),
    submitInfo: getSubmitInfo(state),
    submitable:
        state.getIn(['page', 'domainData', 'permissions', 'data']).includes('update') &&
        state.getIn(['page', 'domainData', 'employeeDetail', 'data', 'options']) &&
        state.getIn(['page', 'domainData', 'employeeDetail', 'data', 'options']).includes('update'),
    isFetching: state.getIn(['page', 'domainData', 'employeeDetail', 'isFetching'])
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    init: () => dispatch(actions.getEmployeeDetail(ownProps.id)),
    onChange: (name, value) => dispatch(actions.modifyEditInfo(name, value)),
    onSubmit: () => dispatch(actions.updateEmployee(ownProps.id)),
    getDealers: () => dispatch(actions.getDealers()),
    onClose: () => {
        dispatch(actions.closeEditPanel());
        dispatch(
            actions.onClickPageBtn({
                pageIndex: PAGE.index
            })
        );
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(localize(EditPage));
