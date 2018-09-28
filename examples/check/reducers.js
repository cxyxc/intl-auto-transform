import {combineReducers} from 'redux-immutable';
import Immutable from 'immutable';
import * as actions from './actions';
import * as userContextActions from 'Shared/actions/currentUserContext';
import {ERROR_CODE} from '../constants';
import initState from './state';
import {getString} from './localize'; // 获取指定id的所有子孙元素

const getAllChild = (arr, id) => {
    let tmpArr = [];
    arr.forEach(a => {
        if(a.parentId === id) {
            tmpArr.push(a);
            const tmp = getAllChild(arr, a.userId);
            tmpArr = tmpArr.concat(tmp);
        }
    });
    return tmpArr;
};

const permissions = (state, action) => {
    switch(action.type) {
        case userContextActions.GET_CURRENT_USER_PAGE_PERMISSIONS_BEGIN:
            return state.set('isFetching', true);

        case userContextActions.GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });

        case userContextActions.GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        default:
            return state;
    }
};

const employees = (state, action) => {
    switch(action.type) {
        case actions.GET_EMPLOYEES_BEGIN:
            return state.set('isFetching', true);

        case actions.GET_EMPLOYEES_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });

        case actions.GET_EMPLOYEES_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        default:
            return state;
    }
};

const employeeDetail = (state, action) => {
    switch(action.type) {
        case actions.GET_EMPLOYEE_DETAIL_BEGIN:
            return state.set('isFetching', true);

        case actions.GET_EMPLOYEE_DETAIL_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });

        case actions.GET_EMPLOYEE_DETAIL_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        case actions.CLOSE_DETAIL_PANEL:
            return Immutable.fromJS(initState.domainData.employeeDetail);

        default:
            return state;
    }
};

const dealers = (state, action) => {
    switch(action.type) {
        case actions.GET_DEALERS_BEGIN:
            return state.set('isFetching', true);

        case actions.GET_DEALERS_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });

        case actions.GET_DEALERS_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        default:
            return state;
    }
};

const employeeAndRelation = (state, action) => {
    switch(action.type) {
        case actions.GET_ALL_EMPLOYEES_BEGIN:
            return state.set('isFetching', true);

        case actions.GET_ALL_EMPLOYEES_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });

        case actions.GET_ALL_EMPLOYEES_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        case actions.CLOSE_EDIT_RELATION_PANEL:
            return Immutable.fromJS(initState.domainData.employeeAndRelation);

        default:
            return state;
    }
};

const submitEditInfo = (state, action) => {
    switch(action.type) {
        case actions.UPDATE_EMPLOYEE_BEGIN:
            return state.set('isFetching', true);

        case actions.UPDATE_EMPLOYEE_SUCCESS:
            return state.set('isFetching', false);

        case actions.UPDATE_EMPLOYEE_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        case actions.CLOSE_EDIT_PANEL:
            return Immutable.fromJS(initState.domainData.submitEditInfo);

        default:
            return state;
    }
};

const submitEditRelationInfo = (state, action) => {
    switch(action.type) {
        case actions.SUBMIT_RELATION_INFO_BEGIN:
            return state.set('isFetching', true);

        case actions.SUBMIT_RELATION_INFO_SUCCESS:
            return state.set('isFetching', false);

        case actions.SUBMIT_RELATION_INFO_FAIL:
            return state.merge({
                isFetching: false,
                message: action.message
            });

        case actions.CLOSE_EDIT_RELATION_PANEL:
            return Immutable.fromJS(initState.domainData.submitEditRelationInfo);

        default:
            return state;
    }
};

const domainData = combineReducers({
    permissions,
    employees,
    employeeDetail,
    dealers,
    employeeAndRelation,
    submitEditInfo,
    submitEditRelationInfo
});

const queryCondition = (state, action) => {
    switch(action.type) {
        case actions.GET_EMPLOYEES_SUCCESS:
            return state.merge(action.condition);

        default:
            return state;
    }
};

const editInfo = (state, action) => {
    switch(action.type) {
        case actions.GET_EMPLOYEE_DETAIL_SUCCESS: {
            const data = action.data;
            return state.merge(data);
        }

        case actions.MODIFY_EDIT_INFO:
            return state.set(action.name, action.value);

        case actions.CLOSE_EDIT_PANEL:
            return Immutable.fromJS(initState.appState.editInfo);

        default:
            return state;
    }
};

const relations = (state, action) => {
    switch(action.type) {
        case actions.GET_ALL_EMPLOYEES_SUCCESS:
            return Immutable.fromJS(action.data.relations);

        case actions.ADD_RELATION: {
            return state.push(
                Immutable.fromJS({
                    userId: action.userId,
                    parentId: action.parentId
                })
            );
        }

        case actions.DELETE_RELATION: {
            const childIds = getAllChild(state.toJS(), action.userId).map(d => d.userId);
            childIds.push(action.userId);
            return state.filterNot(d => childIds.some(c => c === d.get('userId')));
        }

        case actions.CLOSE_EDIT_RELATION_PANEL:
            return Immutable.fromJS(initState.appState.relations);

        default:
            return state;
    }
};

const appState = combineReducers({
    queryCondition,
    editInfo,
    relations
});

const queryPanel = (state, action) => {
    switch(action.type) {
        case actions.MODIFY_QUERY_CONDITION:
            return state.set(action.name, Immutable.fromJS(action.value));

        case actions.REST_QUERY_CONDITION:
            return Immutable.fromJS(initState.uiState.queryPanel);

        case actions.GET_EMPLOYEES_SUCCESS:
            return state
                .set('pageSize', action.condition.pageSize)
                .set('sortField', action.condition.sortField)
                .set('isDesc', action.condition.isDesc);

        default:
            return state;
    }
};

const droggableTree = (state, action) => {
    switch(action.type) {
        case actions.MODIFY_DRAG_TREE_STATE:
            return state.merge(action.data);

        case actions.ADD_RELATION: {
            const expandedKeys = state.get('expandedKeys').toJS();
            expandedKeys.push(action.parentId);
            return state.merge({
                expandedKeys,
                selectedKeys: [action.userId],
                autoExpandParent: true
            });
        }

        case actions.CLOSE_EDIT_RELATION_PANEL:
            return Immutable.fromJS(initState.uiState.droggableTree);

        default:
            return state;
    }
};

const uiState = combineReducers({
    queryPanel,
    droggableTree
});

const notification = (state, action) => {
    if(action.notificationType) {
        let message = '';
        if(action.message) message = action.message;
        else if(action.statusCode === ERROR_CODE) message = getString('reducers.clientError');
        else message = getString('reducers.serverError');
        return state.merge({
            timeStamp: action.timeStamp,
            type: action.notificationType,
            message
        });
    }

    return state;
};

export default combineReducers({
    domainData,
    appState,
    uiState,
    notification
});
