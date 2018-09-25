import React from 'react';
import PropTypes from 'prop-types';
import {Card, Spin, Collapse} from 'antd';
import CustomerDetailInfo from './CustomerDetailInfo';
import SelectVehicle from './SelectVehicle';
import ValueAddedInfo from './ValueAddedInfo';
import SummaryAmountPanel from './SummaryAmountPanel';
import styles from './style.css';
const Panel = Collapse.Panel;

class MatchVehiclePanel extends React.PureComponent {
    componentDidMount() {
        this.props.getInitData(this.props.id);
    }

    render() {
        return (
            <Spin spinning={this.props.loading} className={styles.stepsContent0}>
                <SelectVehicle history={this.props.history} id={this.props.id}/>
                <Collapse>
                    <Panel header={this.props.getString('OTHER_INFO')}>
                        <CustomerDetailInfo/>
                        <Card title={this.props.getString('VALUE_ADDED_LIST')} >
                            <ValueAddedInfo id={this.props.id} disabled={true}/>
                        </Card>
                        <Card title={this.props.getString('AMOUNT_TOTAL')} >
                            <SummaryAmountPanel/>
                        </Card>
                    </Panel>
                </Collapse>
            </Spin>
        );
    }
}


MatchVehiclePanel.propTypes = {
    getInitData: PropTypes.func.isRequired,
    getString: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    id: PropTypes.string,
    loading: PropTypes.bool,
    regionSelectDefaultOption: PropTypes.object,
};

import {connect} from 'react-redux';
import * as actions from './actions';
import {createSelector} from 'reselect';
import isEmpty from 'lodash/isEmpty';
import {localize} from './localize';

const getRegionSelectDefaultOption = createSelector(state => state.getIn(['page', 'domainData', 'retailContractDetail', 'data']), detail => {
    const tmpDetail = detail.toJS();
    if(tmpDetail && !isEmpty(tmpDetail)) {
        const regionSelectDefaultOption = {
            regionId: tmpDetail.regionId,
            regionName: tmpDetail.regionName,
            provinceId: tmpDetail.provinceId,
            provinceName: tmpDetail.provinceName,
            cityId: tmpDetail.cityId,
            cityName: tmpDetail.cityName,
            countyId: tmpDetail.districtId,
            countyName: tmpDetail.districtName,
        };
        return regionSelectDefaultOption;
    }
    return {};
});

const mapStateToProps = state => ({
    regionSelectDefaultOption: getRegionSelectDefaultOption(state),
    loading: state.getIn(['page', 'domainData', 'retailContractDetail', 'isFetching']),
});

const mapDispatchToProps = dispatch => ({
    getInitData: id => {
        dispatch(actions.getInitData());
        dispatch(actions.getDetail(id));
        dispatch(actions.getValueAddeds(id));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(localize(MatchVehiclePanel));
