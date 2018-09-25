import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import {notification} from 'antd';
import 'Shared/styles/form.css';
import 'Shared/styles/row-col.css';
import routes from './routes';
import Breadcrumb from 'Shell/components/Breadcrumb';
import QueryPage from './QueryPage';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import EditRelationPage from './EditRelationPage';
import 'ant-design-pro/dist/ant-design-pro.css';
import NoMatchRoute from '../common/NoMatchRoute';
export class App extends PureComponent {
    componentDidMount() {
        this.props.init();
    }

    componentWillReceiveProps(nextProps) {
        const preNotification = this.props.notification;
        if(preNotification.timeStamp !== nextProps.notification.timeStamp)
            notification[nextProps.notification.type]({
                message: nextProps.notification.message
            });
    }

    render() {
        return (
            <div>
                <Route render={p => <Breadcrumb location={p.location} />} />
                <div className="page-main">
                    <Switch>
                        <Route exact path={routes.query.url()} render={p => <QueryPage history={p.history} />} />
                        <Route exact path={routes.update.url()} render={p => <EditPage id={p.match.params.id} history={p.history} />} />
                        <Route exact path={routes.detail.url()} render={p => <DetailPage id={p.match.params.id} history={p.history} />} />
                        <Route exact path={routes.updateRelation.url()} render={p => <EditRelationPage history={p.history} />} />
                        <NoMatchRoute link={routes.query.url()} />
                    </Switch>
                </div>
            </div>
        );
    }
}
App.propTypes = {
    init: PropTypes.func,
    notification: PropTypes.object
};
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import * as actions from './actions.js';
const getNotification = createSelector(state => state.getIn(['page', 'notification']), data => data.toJS());

const mapStateToProps = state => ({
    notification: getNotification(state)
});

const mapDispatchToProps = dispatch => ({
    init: () => {
        dispatch(actions.getCurrentUserPagePermissions('sales-employee'));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
