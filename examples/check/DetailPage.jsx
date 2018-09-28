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
                        title={getString('detailPage.basicInformation')}
                        style={{
                            marginBottom: 32
                        }}>
                        <Description term={getString('detailPage.username')}>{data.username}</Description>
                        <Description term={getString('detailPage.name')}>{data.name}</Description>
                        <Description term={getString('detailPage.sex')}>{conventEnumValueToString(sex, data.sex, this.props.language)}</Description>
                        <Description term={getString('detailPage.job')}>
                            {conventEnumValueToString(jobType, data.job, this.props.language)}
                        </Description>
                        <Description term={getString('detailPage.dealerName')}>{data.dealerName}</Description>
                        <Description term={getString('detailPage.jobDescription')}>{data.jobDescription}</Description>
                        <Description term={getString('detailPage.remark')}>{data.remark}</Description>
                    </DescriptionList>
                    <Divider />
                    <DescriptionList
                        size="large"
                        title={getString('detailPage.personnelInformation')}
                        style={{
                            marginBottom: 32
                        }}>
                        <Description term={getString('detailPage.photo')}>
                            {data.photoId && (
                                <img
                                    className={styles.avatar}
                                    src={`${fetch.basePath}${API.files}/${data.photoId}`}
                                    alt={getString('detailPage.headPortrait')}/>
                            )}
                        </Description>
                        <Description term={getString('detailPage.nationality')}>{data.nationality}</Description>
                        <Description term={getString('detailPage.idNumber')}>{data.idNumber}</Description>
                        <Description term={getString('detailPage.birthday')}>{formatDateTimeStr(data.birthday, DATA_FORMAT)}</Description>
                        <Description term={getString('detailPage.education')}>
                            {conventEnumValueToString(educationType, data.education, this.props.language)}
                        </Description>
                        <Description term={getString('detailPage.ethnic')}>{data.ethnic}</Description>
                        <Description term={getString('detailPage.political')}>
                            {conventEnumValueToString(politicalType, data.political, this.props.language)}
                        </Description>
                        <Description term={getString('detailPage.cellNumber')}>{data.cellNumber}</Description>
                        <Description term={getString('detailPage.phoneNumber')}>{data.phoneNumber}</Description>
                        <Description term={getString('detailPage.email')}>{data.email}</Description>
                        <Description term={getString('detailPage.address')}>{data.address}</Description>
                    </DescriptionList>
                </Card>
                <div className="page-toolbar">
                    <Button type="primary" onClick={this.onReturn}>
                        {getString('detailPage.return')}
                    </Button>
                </div>
            </div>
        );
    }
}

DetailPage.propTypes = {
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
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
