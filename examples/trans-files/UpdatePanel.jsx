import React from 'react';
import PropTypes from 'prop-types';
import {Card, Steps, Button, notification, Alert, Collapse, Spin} from 'antd';
import CustomerInfo from './CustomerInfo';
import ProductInfo from './ProductInfo';
import ValueAddedInfo from './ValueAddedInfo';
import RetailContractPage from './RetailContractPage';
import SimpleValueAddedQueryPanel from '../common/SimpleValueAddedQueryPanel';
import routes from './routes';
import styles from './style.css';
const Step = Steps.Step;
const Panel = Collapse.Panel;


class UpdatePanel extends React.PureComponent {
    state = {
        isSubmitting: false
    }

    componentDidMount() {
        this.props.getInitData(this.props.id);
    }

    submit = () => {
        this.setState({isSubmitting: true});
        this.props.submit(this.props.id).then(data => {
            this.setState({isSubmitting: true});
            if(data && data.success) {
                this.props.resetPanel();
                this.props.history.push(routes.query.url());
                this.props.refreshList();
            } else {
                const message = [];
                if(data && data.emptyErrors && data.emptyErrors.length > 0)
                    message.push(`${data.emptyErrors.join('、')} ${this.props.getString('VALIDATE_MESSAGE_1')}`);
                if(data && data.valueAddedQuantityError && data.valueAddedQuantityError.length > 0)
                    message.push(`${this.props.getString('VALIDATE_MESSAGE_2')}：${data.valueAddedQuantityError.join('、')} ${this.props.getString('VALIDATE_MESSAGE_3')}`);
                if(message.length > 0)
                    notification.warning({
                        message: `${message.join('；')}`
                    });
            }
        });
    }
    render() {
        const alertMessage = <Alert message={this.props.getString('ALERT_MESSAGE')} type="info" />;
        const submitable = this.props.submitable;
        const steps = [{
            title: this.props.getString('STEP_1_TITLE'),
            content:
                <div>
                    <CustomerInfo regionSelectDefaultOption={this.props.regionSelectDefaultOption} />
                    <ProductInfo />
                    <Card className={this.props.rtl ? styles.rtlTextLeft : `form-standard ${styles.fixBtn}`}>
                        <Button onClick={this.props.lastStep}>{this.props.getString('SETP_1_CONTENT')}</Button>
                        <Button className={this.props.rtl ? styles.marginRight : ''} type="primary" onClick={this.props.nextStep}>{this.props.getString('NEXT_SETP')}</Button>
                    </Card>
                </div>

        },
        {
            title: this.props.getString('SETP_2_TITLE'),
            content:
                <div>
                    <Card title={this.props.getString('SETP_2_CONTENT')} >
                        <ValueAddedInfo id={this.props.id} />
                    </Card>
                    <Collapse>
                        <Panel header={this.props.getString('SETP_2_TITLE')}>
                            <SimpleValueAddedQueryPanel alertMessage={alertMessage}
                                data={this.props.valueAddedProducts}
                                query={this.props.queryValueAdded}
                                selectData={this.props.selectValueAdded}
                                tableClassName={styles.cursorStyle} />
                        </Panel>
                    </Collapse>
                    <Card className={this.props.rtl ? styles.rtlTextLeft : `form-standard ${styles.fixBtn}`}>
                        <Button onClick={this.props.prevStep}>{this.props.getString('PERV_SETP')}</Button>
                        <Button className={this.props.rtl ? styles.marginRight : ''} type="primary" onClick={this.props.nextStep}>{this.props.getString('NEXT_SETP')}</Button>
                    </Card>
                </div>
        }, {
            title: this.props.getString('SETP_3_TITLE'),
            content:
                <div>
                    <RetailContractPage />
                    <Card className={this.props.rtl ? styles.rtlTextLeft : `form-standard ${styles.fixBtn}`}>
                        <Button onClick={this.props.prevStep}>{this.props.getString('PERV_SETP')}</Button>
                        <Button className={this.props.rtl ? styles.marginRight : ''} type="primary"
                            disabled={!submitable}
                            loading={this.state.isSubmitting}
                            onClick={this.submit}>{this.props.getString('SUBMIT')}</Button>
                    </Card>
                </div>
        }];

        return (
            <div>
                <Spin spinning={this.props.loading}>
                    <Steps current={this.props.currentStep} className={styles.stepsHeader}>
                        {steps.map(item =>
                            <Step key={item.title} title={item.title} />
                        )}
                    </Steps>
                    <div className={styles.stepsContent0}>{steps[this.props.currentStep].content}</div>
                </Spin>
            </div>
        );
    }
}


UpdatePanel.propTypes = {
    currentStep: PropTypes.number.isRequired,
    getInitData: PropTypes.func.isRequired,
    getString: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    lastStep: PropTypes.func.isRequired,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    queryValueAdded: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired,
    rtl: PropTypes.string.isRequired,
    selectValueAdded: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    valueAddedProducts: PropTypes.object.isRequired,
    id: PropTypes.string,
    loading: PropTypes.bool,
    regionSelectDefaultOption: PropTypes.object,
    resetPanel: PropTypes.func,
    submitable: PropTypes.bool
};

import {connect} from 'react-redux';
import * as actions from './actions';
import {createSelector} from 'reselect';
import isEmpty from 'lodash/isEmpty';
import {localize} from './localize';

const getValueAddedProducts = createSelector(state => state.getIn(['page', 'domainData', 'valueAddedProducts']),
    state => state.getIn(['page', 'appState', 'selectedValueAddedIds']), (data, ids) => {
        const list = [];
        data = data.toJS();
        ids = ids.toJS();
        data.data.forEach(d => {
            const index = ids.findIndex(id => d.id === id.id);
            d.isSelected = index !== -1;
            list.push(d);
        });

        return {
            isFetching: data.isFetching,
            message: data.message,
            total: data.total,
            data: list
        };
    });

const getRegionSelectDefaultOption = createSelector(state => state.getIn(['page', 'domainData', 'retailContractDetail', 'data']), detail => {
    const tmpDetail = detail.toJS();
    if(tmpDetail && !isEmpty(tmpDetail)) {
        const regionSelectDefaultOption = {
            regionId: tmpDetail.regionId,
            regionName: tmpDetail.regionName,
            provinceId: tmpDetail.provinceId || '',
            provinceName: tmpDetail.provinceName || '',
            cityId: tmpDetail.cityId || '',
            cityName: tmpDetail.cityName || '',
            countyId: tmpDetail.districtId || '',
            countyName: tmpDetail.districtName || '',
        };
        return regionSelectDefaultOption;
    }
    return {};
});

const mapStateToProps = state => ({
    currentStep: state.getIn(['page', 'appState', 'currentStep']),
    valueAddedProducts: getValueAddedProducts(state),
    regionSelectDefaultOption: getRegionSelectDefaultOption(state),
    loading: state.getIn(['page', 'domainData', 'retailContractDetail', 'isFetching']),
    submitable: state.getIn(['page', 'domainData', 'initData', 'permissions']).includes('update') &&
        state.getIn(['page', 'domainData', 'retailContractDetail', 'data', 'options']) &&
        state.getIn(['page', 'domainData', 'retailContractDetail', 'data', 'options']).includes('update'),
});

const mapDispatchToProps = dispatch => ({
    getInitData: id => {
        dispatch(actions.getInitData());
        dispatch(actions.getDetail(id));
        dispatch(actions.getValueAddeds(id));
    },
    queryValueAdded: condition => dispatch(actions.searchValueAddeds(condition)),
    submit: id => dispatch(actions.submit(id)),
    nextStep: () => dispatch(actions.nextStep()),
    prevStep: () => dispatch(actions.prevStep()),
    selectValueAdded: data => dispatch(actions.saveSelectedValueAdded(data)),
    resetPanel: () => dispatch(actions.resetAddPanel()),
    refreshList: () => dispatch(actions.refreshList()),
    lastStep: () => dispatch(actions.lastStep()),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(UpdatePanel));
