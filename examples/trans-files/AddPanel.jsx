import React from 'react';
import PropTypes from 'prop-types';
import {Card, Steps, Button, notification, Alert, Collapse} from 'antd';
import CustomerInfo from './CustomerInfo';
import ProductInfo from './ProductInfo';
import ValueAddedInfo from './ValueAddedInfo';
import RetailContractPage from './RetailContractPage';
import SimpleValueAddedQueryPanel from '../common/SimpleValueAddedQueryPanel';
import routes from './routes';
import styles from './style.css';
const Step = Steps.Step;
const Panel = Collapse.Panel;

class AddPanel extends React.PureComponent {
    state = {
        isSubmitting: false
    }
    componentDidMount() {
        this.props.getInitData();
    }

    submit = () => {
        this.setState({isSubmitting: true});
        this.props.submit().then(data => {
            this.setState({isSubmitting: false});
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
                        <ValueAddedInfo />
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
                            onClick={this.submit}
                            loading={this.state.isSubmitting}
                            disabled={!this.props.submitable}>
                            {this.props.getString('SUBMIT')}
                        </Button>
                    </Card>
                </div>
        }];

        return (
            <div>
                <Steps current={this.props.currentStep} className={styles.stepsHeader}>
                    {steps.map(item =>
                        <Step key={item.title} title={item.title} />
                    )}
                </Steps>
                <div className={styles.stepsContent0}>{steps[this.props.currentStep].content}</div>
            </div>
        );
    }
}


AddPanel.propTypes = {
    valueAddedProducts: PropTypes.object.isRequired,
    currentStep: PropTypes.number.isRequired,
    getInitData: PropTypes.func.isRequired,
    getString: PropTypes.func.isRequired,
    queryValueAdded: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    lastStep: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    rtl: PropTypes.string.isRequired,
    submit: PropTypes.func.isRequired,
    submitable: PropTypes.bool,
    nextStep: PropTypes.func.isRequired,
    prevStep: PropTypes.func.isRequired,
    selectValueAdded: PropTypes.func.isRequired,
    refreshList: PropTypes.func.isRequired,
    regionSelectDefaultOption: PropTypes.object,
    resetPanel: PropTypes.func
};

import {connect} from 'react-redux';
import * as actions from './actions';
import {createSelector} from 'reselect';
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
const getRegionSelectDefaultOption = createSelector(state => state.getIn(['page', 'appState', 'currentStep']),
    state => state.getIn(['page', 'appState', 'customerInfo']), (currentStep, customerInfo) => {
        const info = customerInfo.toJS();
        if(info && info.regions && info.regions.length > 0) {
            const regionSelectDefaultOption = {
                regionId: info.regions[0].id,
                regionName: info.regions[0].name,
                provinceId: info.regions[1] && info.regions[1].id ? info.regions[1].id : '',
                provinceName: info.regions[1] && info.regions[1].name ? info.regions[1].name : '',
                cityId: info.regions[2] && info.regions[2].id ? info.regions[2].id : '',
                cityName: info.regions[2] && info.regions[2].name ? info.regions[2].name : '',
                countyId: info.regions[3] && info.regions[3].id ? info.regions[3].id : '',
                countyName: info.regions[3] && info.regions[3].name ? info.regions[3].name : '',
            };
            return regionSelectDefaultOption;
        }
        return {};
    });

const mapStateToProps = state => ({
    currentStep: state.getIn(['page', 'appState', 'currentStep']),
    valueAddedProducts: getValueAddedProducts(state),
    regionSelectDefaultOption: getRegionSelectDefaultOption(state),
    submitable: state.getIn(['page', 'domainData', 'initData', 'permissions']).includes('add'),
});

const mapDispatchToProps = dispatch => ({
    getInitData: () => dispatch(actions.getInitData()),
    refreshList: () => dispatch(actions.refreshList()),
    queryValueAdded: condition => dispatch(actions.searchValueAddeds(condition)),
    submit: () => dispatch(actions.submit()),
    nextStep: () => dispatch(actions.nextStep()),
    prevStep: () => dispatch(actions.prevStep()),
    selectValueAdded: data => dispatch(actions.saveSelectedValueAdded(data)),
    resetPanel: () => dispatch(actions.resetAddPanel()),
    lastStep: () => dispatch(actions.lastStep()),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(AddPanel));
