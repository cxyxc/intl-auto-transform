import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Row, Col, Card, Spin, Button} from 'antd';
import DraggableTable from './DraggableTable';
import DraggableTree from './DraggableTree';
import {PAGE} from '../../constants';
import styles from '../style.css';
import routes from '../routes';

class EditRelationPage extends PureComponent {
    componentDidMount() {
        this.props.init();
    }
    onClose = () => {
        this.props.onClose();
        this.props.history.push(routes.query.url());
    }
    onOk = () => {
        this.props.onSubmit().then(isOk => {
            if(isOk)
                this.onClose();
        });
    }
    render() {
        const {getString, updateable: submitable} = this.props;
        return (
            <div>
                <Spin spinning={this.props.isFetching}>
                    <Card className={styles.card_margin}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <DraggableTable />
                            </Col>
                            <Col span={12}>
                                <DraggableTree />
                            </Col>
                        </Row>
                    </Card>
                    <Card className={`${styles.card_margin} ${styles.optionBtn}`}>
                        <Button
                            type="primary"
                            disabled={!submitable}
                            loading={this.props.submitInfo.isFetching}
                            onClick={this.onOk}>{getString('SUBMIT')}</Button>
                    </Card>
                </Spin>
                <div className="page-toolbar">
                    <Button type="primary" onClick={this.onClose}>{getString('RETURN')}</Button>
                </div>
            </div>
        );
    }
}

EditRelationPage.propTypes = {
    getString: PropTypes.func.isRequired,
    history: PropTypes.object,
    init: PropTypes.func,
    isFetching: PropTypes.bool,
    submitInfo: PropTypes.object,
    updateable: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};
import {connect} from 'react-redux';
import * as actions from '../actions.js';
import {selectorFactory} from 'Shared/utils/immutableToJsSelectorFactory';
import {localize} from '../localize';

const getSubmitInfo = selectorFactory(['page', 'domainData', 'submitEditRelationInfo']);

const mapStateToProps = state => ({
    isFetching: state.getIn(['page', 'domainData', 'employeeAndRelation', 'isFetching']),
    submitInfo: getSubmitInfo(state),
    updateable: state.getIn(['page', 'domainData', 'permissions', 'data']).includes('updateRelation')
});

const mapDispatchToProps = dispatch => ({
    init: () => dispatch(actions.getAllEmployees()),
    onSubmit: () => dispatch(actions.submitRelationInfo()),
    onClose: () => {
        dispatch(actions.closeEditRelationPanel());
        dispatch(actions.onClickPageBtn({
            pageIndex: PAGE.index
        }));
    }
});

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(localize(EditRelationPage)));
