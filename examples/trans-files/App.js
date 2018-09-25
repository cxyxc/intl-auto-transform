import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import RetailContractQueryPanel from './RetailContractQueryPanel';
import RetailContractTablePanel from './RetailContractTablePanel';
import {Card, Button, notification} from 'antd';
import routes from './routes';
import {Route, Switch} from 'react-router-dom';
import Breadcrumb from 'Shell/components/Breadcrumb';
import {createNotification} from 'Shared/utils/serverNotification';
import RetailContractDetail from './RetailContractDetail';
import ValueAddedDetailList from './ValueAddedDetailList';
import AddPanel from './AddPanel';
import UpdatePanel from './UpdatePanel';
import MatchVehiclePanel from './MatchVehiclePanel';
import LogList from './LogList';
import 'ant-design-pro/dist/ant-design-pro.css';
import NoMatchRoute from '../common/NoMatchRoute';

export class App extends PureComponent {
    componentDidMount() {
        notification.config({
            top: 50
        });
    }

    componentWillReceiveProps(nextProps) {
        createNotification(nextProps.notification, this.props.notification);
    }

    render() {
        return (
            <div>
                <Route render={props => <Breadcrumb location={props.location} />} />
                <div className="page-main">
                    <Switch>
                        <Route path={routes.query.url()} exact render={props =>
                            <div>
                                <Card> <RetailContractQueryPanel history={props.history}/></Card>
                                <Card> <RetailContractTablePanel language={this.props.language} history={props.history}/></Card>
                            </div>} />
                        <Route path={routes.add.url()} exact render={props =>
                            <div>
                                <div className="page-toolbar">
                                    <Button type="primary" onClick={this.props.resetPanel} href={`#${routes.query.url()}`}>{this.props.getString('RETURN')}</Button>
                                </div>
                                <div>
                                    <AddPanel history={props.history}/>
                                </div>
                            </div>} />
                        <Route path={routes.update.url()} exact render={props =>
                            <div>
                                <div className="page-toolbar">
                                    <Button type="primary" onClick={this.props.resetPanel} href={`#${routes.query.url()}`}>{this.props.getString('RETURN')}</Button>
                                </div>
                                <div>
                                    <UpdatePanel history={props.history} id={props.match.params.id}/>
                                </div>
                            </div>} />
                        <Route path={routes.matchVehicle.url()} exact render={props =>
                            <div>
                                <div className="page-toolbar">
                                    <Button type="primary" onClick={this.props.resetPanel} href={`#${routes.query.url()}`}>{this.props.getString('RETURN')}</Button>
                                </div>
                                <div>
                                    <MatchVehiclePanel history={props.history} id={props.match.params.id}/>
                                </div>
                            </div>} />
                        <Route path={routes.detail.url()} exact render={props =>
                            <div>
                                <div className="page-toolbar">
                                    <Button type="primary" onClick={this.props.resetPanel} href={`#${routes.query.url()}`}>{this.props.getString('RETURN')}</Button>
                                </div>
                                <div>
                                    <RetailContractDetail id={props.match.params.id} />
                                    <ValueAddedDetailList id={props.match.params.id} />
                                    <LogList id={props.match.params.id} />
                                </div>
                            </div>} />
                        <NoMatchRoute link={routes.query.url()} />
                    </Switch>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    notification: PropTypes.object,
    getString: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    resetPanel: PropTypes.func,
};

import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {localize} from './localize';
import * as actions from './actions';

const getNotification = createSelector(state => state.getIn(['page', 'notification']), data => data.toJS());
const mapStateToProps = state => ({
    notification: getNotification(state)
});

const mapDispatchToProps = dispatch => ({
    resetPanel: () => dispatch(actions.resetAddPanel())
});

export default connect(mapStateToProps, mapDispatchToProps)(localize(App));
