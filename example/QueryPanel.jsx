import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Row, Col} from 'antd';
import {vehicleOrderStatus} from '../../Enum';
import {PAGE_PERMISSION} from './constants';
import {FORM_OPTIONS, FORM_ROW_OPTIONS} from '../../constants';
import routes from './routes';
import TagSelect from 'Shared/components/TagSelect';
import TextArea from 'Shared/components/TextArea';
import DateRangePicker from 'Shared/components/DateRangePicker';
import TextInput from 'Shared/components/TextInput';
import WrappedSelect from '../../common/WrappedSelect';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;

const statusOptions = vehicleOrderStatus.pick([vehicleOrderStatus.新建, vehicleOrderStatus.提交, vehicleOrderStatus.作废]).toList();

class QueryPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleExportClick = this.handleExportClick.bind(this);
    }
    componentDidMount() {
        this.props.queryInitData();
    }

    handleAddClick() {
        this.props.history.push(routes.add.url());
    }

    handleExportClick() {
        this.props.exportData();
    }

    render() {
        let primaryOperation = null;
        const otherOperations = [];
        const hasPermission = option => this.props.permissions.some(item => item === option);

        if(hasPermission(PAGE_PERMISSION.add))
            otherOperations.push(<Button key={PAGE_PERMISSION.export} onClick={this.handleExportClick}>导出</Button>);

        if(hasPermission(PAGE_PERMISSION.add))
            primaryOperation = <Button key={PAGE_PERMISSION.add} type="primary" onClick={this.handleAddClick}>新增</Button>;


        const marketOptions = this.props.marketingDepartments.map(d => ({
            value: d.id,
            text: d.name
        }));
        return (
            <Form className="form-standard">
                <Row>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="订单编号" {...FORM_OPTIONS.item}>
                            <TextArea name="codes"
                                value={this.props.conditions.codes}
                                placeholder="最多输入1000个，以回车隔开"
                                onBlur={this.props.onConditionsChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="经销商编号" {...FORM_OPTIONS.item}>
                            <TextArea name="dealerCodes"
                                value={this.props.conditions.dealerCodes}
                                placeholder="最多输入1000个，以回车隔开"
                                onBlur={this.props.onConditionsChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="经销商名称" {...FORM_OPTIONS.item}>
                            <TextInput id="dealerName" value={this.props.conditions.dealerName}
                                onBlur={this.props.onConditionsChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="创建时间" {...FORM_OPTIONS.item}>
                            <DateRangePicker
                                id="createTime"
                                value={this.props.conditions.createTime}
                                onChange={this.props.onConditionsChange} />
                        </FormItem>
                    </Col>
                    <Col {...FORM_OPTIONS.col}>
                        <FormItem label="大区" {...FORM_OPTIONS.item}>
                            <WrappedSelect
                                name="marketIds"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                value={this.props.conditions.marketIds}
                                options={marketOptions}
                                onChange={this.props.onConditionsChange} />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <FormItem label="状态" {...FORM_ROW_OPTIONS.item}>
                        <TagSelect name="status"
                            onChange={this.props.onConditionsChange}
                            value={this.props.conditions.status}
                            options={statusOptions}/>
                    </FormItem>
                </Row>
                <Row className="operation-buttons">
                    <Col span={8}>
                        <Button key="query" type="primary" onClick={this.props.searchList} loading={this.props.loading}>查询</Button>
                        <Button key="clear" onClick={this.props.onResetClick}>重置</Button>
                    </Col>
                    <Col span={16} className="col-align-right">
                        <ButtonGroup>{otherOperations}</ButtonGroup>
                        {primaryOperation}
                    </Col>
                </Row>
            </Form>
        );
    }
}

QueryPanel.propTypes = {
    conditions: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    permissions: PropTypes.array.isRequired,
    queryInitData: PropTypes.func.isRequired,
    searchList: PropTypes.func.isRequired,
    onConditionsChange: PropTypes.func.isRequired,
    onResetClick: PropTypes.func.isRequired,
    exportData: PropTypes.func,
    marketingDepartments: PropTypes.array,
};

import {connect} from 'react-redux';
import {saveQueryCondition, searchList, getInitData, resetQueryPanel, exportData} from './actions';
import selectorFactory from 'Shared/utils/immutableToJsSelectorFactory';


const getConditions = selectorFactory(['page', 'appState', 'queryCondition']);
const getPermissions = selectorFactory(['page', 'domainData', 'initData', 'permissions']);
const getMarketingDepartments = selectorFactory(['page', 'domainData', 'initData', 'marketingDepartments']);

const mapStateToProps = state => ({
    permissions: getPermissions(state),
    conditions: getConditions(state),
    loading: state.getIn(['page', 'domainData', 'list', 'isFetching']),
    marketingDepartments: getMarketingDepartments(state)
});

const mapDispatchToProps = dispatch => ({
    onConditionsChange: (value, id) => dispatch(saveQueryCondition({[id]: value})),
    searchList: () => dispatch(searchList()),
    queryInitData: () => dispatch(getInitData()),
    onResetClick: () => dispatch(resetQueryPanel()),
    exportData: () => dispatch(exportData()),

    
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryPanel);
