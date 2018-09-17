import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import QueryPanel from './QueryPanel';
import TablePanel from './TablePanel';
import DetailPage from './DetailPage';
import AddPage from './AddPage';
import UpdatePage from './UpdatePage';
import {Card} from 'antd';
import routes from './routes';
import {Route, Switch} from 'react-router-dom';
import Breadcrumb from 'Shell/components/Breadcrumb';
import {createNotification} from 'Shared/utils/serverNotification';
import 'ant-design-pro/dist/ant-design-pro.css';
import NoMatchRoute from '../../common/NoMatchRoute';

export class App extends PureComponent {
    componentDidUpdate(prevProps) {
        createNotification(this.props.notification, prevProps.notification);
    }

    render() {
        return (
            <div>
                <Route render={props => <Breadcrumb location={props.location} />} />
                <div className="page-main">
                    <Switch>
                        <Route path={routes.query.url()} exact render={props =>
                            <div>
                                <Card> <QueryPanel history={props.history}/></Card>
                                <Card> <TablePanel history={props.history}/></Card>
                            </div>} />
                        <Route path={routes.add.url()} exact render={props =>
                            <AddPage history={props.history}/>} />

                        <Route path={routes.update.url()} exact render={props =>
                            <UpdatePage history={props.history} id={props.match.params.id}/>} />

                        <Route path={routes.detail.url()} exact render={props =>
                            <DetailPage id={props.match.params.id} history={props.history}/>} />
                        <NoMatchRoute link={routes.query.url()} />
                    </Switch>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    notification: PropTypes.object
};

import {connect} from 'react-redux';
import {createSelector} from 'reselect';

const getNotification = createSelector(state => state.getIn(['page', 'notification']), data => data.toJS());
const mapStateToProps = state => ({
    notification: getNotification(state)
});

export default connect(mapStateToProps)(App);
