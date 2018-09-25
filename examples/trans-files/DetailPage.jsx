import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Divider, Card, Button} from 'antd';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import {DATA_FORMAT, API} from '../constants';
import {jobType, sex, educationType, politicalType} from '../Enum';
const {Description} = DescriptionList;
import {formatDateTimeStr, conventEnumValueToString} from '../utils';
import styles from './style.css';
import routes from './routes';

class DetailPage extends PureComponent {
    componentDidMount() {
        this.props.init();
    }

    onReturn = () => {
        this.props.history.push(routes.query.url());
        this.props.onClose();
    };

    render() {
        const {getString} = this.props;
        const {data, isFetching} = this.props.employeeInfo;
        return (
            <div>
                <Card loading={isFetching}>
                    <DescriptionList
                        size="large"
                        title={getString('BASIC_INFORMATION')}
                        style={{
                            marginBottom: 32
                        }}>
                        <Description term={getString('USERNAME')}>{data.username}</Description>
                        <Description term={getString('NAME')}>{data.name}</Description>
                        <Description term={getString('SEX')}>{conventEnumValueToString(sex, data.sex)}</Description>
                        <Description term={getString('JOB')}>{conventEnumValueToString(jobType, data.job)}</Description>
                        <Description term={getString('DEALER_NAME')}>{data.dealerName}</Description>
                        <Description term={getString('JOB_DESCRIPTION')}>{data.jobDescription}</Description>
                        <Description term={getString('REMARK')}>{data.remark}</Description>
                    </DescriptionList>
                    <Divider />
                    <DescriptionList
                        size="large"
                        title={getString('PERSONNEL_INFORMATION')}
                        style={{
                            marginBottom: 32
                        }}>
                        <Description term={getString('PHOTO')}>
                            {data.photoId && (
                                <img
                                    className={styles.avatar}
                                    src={`${fetch.basePath}${API.files}/${data.photoId}`}
                                    alt={getString('HEAD_PORTRAIT')}/>
                            )}
                        </Description>
                        <Description term={getString('NATIONALITY')}>{data.nationality}</Description>
                        <Description term={getString('ID_NUMBER')}>{data.idNumber}</Description>
                        <Description term={getString('BIRTHDAY')}>{formatDateTimeStr(data.birthday, DATA_FORMAT)}</Description>
                        <Description term={getString('EDUCATION')}>{conventEnumValueToString(educationType, data.education)}</Description>
                        <Description term={getString('ETHNIC')}>{data.ethnic}</Description>
                        <Description term={getString('POLITICAL')}>{conventEnumValueToString(politicalType, data.political)}</Description>
                        <Description term={getString('CELL_NUMBER')}>{data.cellNumber}</Description>
                        <Description term={getString('PHONE_NUMBER')}>{data.phoneNumber}</Description>
                        <Description term={getString('EMAIL')}>{data.email}</Description>
                        <Description term={getString('ADDRESS')}>{data.address}</Description>
                    </DescriptionList>
                </Card>
                <div className="page-toolbar">
                    <Button type="primary" onClick={this.onReturn}>
                        {getString('RETURN')}
                    </Button>
                </div>
            </div>
        );
    }
}

DetailPage.propTypes = {
    getString: PropTypes.func.isRequired,
    employeeInfo: PropTypes.object,
    history: PropTypes.object,
    id: PropTypes.string,
    init: PropTypes.func,
    onClose: PropTypes.func
};
import {connect} from 'react-redux';
import * as actions from './actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from './localize';
const getEmployee = selectorFactory(['page', 'domainData', 'employeeDetail']);

const mapStateToProps = state => ({
    employeeInfo: getEmployee(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    init: () => dispatch(actions.getEmployeeDetail(ownProps.id)),
    onClose: () => dispatch(actions.closeDetailPanel())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(localize(DetailPage));
