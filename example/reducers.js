import {combineReducers} from 'redux-immutable';
import * as actions from './actions';
import Immutable from 'immutable';
import {vehicleOrderPlanDetailIntention, vehicleOrderDetailExtendShippingMethod} from '../../Enum';
import {GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS, GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL} from 'Shared/actions/currentUserContext';

const initData = (state, action) => {
    switch(action.type) {
        case actions.GET_INIT_DATA_BEGIN:
            return state.merge({
                isFetching: true,
            });
        case actions.GET_INIT_DATA_SUCCESS:
            return state.merge({
                isFetching: false,
                marketingDepartments: action.data.marketingDepartments,
                vehicleSalesOrganization: action.data.vehicleSalesOrganization,
                branch: action.data.branch,
                distributionChannel: action.data.distributionChannel,
                fundsTypes: action.data.fundsTypes,
            });
        case actions.GET_INIT_DATA_FAIL:
            return state.merge({
                isFetching: false,
                marketingDepartments: [],
                vehicleSalesOrganization: {},
                branch: {},
                distributionChannel: {},
                fundsTypes: [],
            });
        case GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS:
            return state.merge({
                permissions: action.data
            });
        case GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL:
            return state.merge({
                permissions: []
            });
        default:
            return state;
    }
};

const list = (state, action) => {
    switch(action.type) {
        case actions.GET_LIST_DATA_BEGIN:
            return state.merge({
                isFetching: true,
            });
        case actions.GET_LIST_DATA_SUCCESS:
            return state.merge({
                isFetching: false,
                total: action.data.totalElements,
                data: action.data.content
            });
        case actions.GET_LIST_DATA_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};


const queryCondition = (state, action) => {
    switch(action.type) {
        case actions.SAVE_QUERY_CONDITION:
            return state.merge(action.obj);
        case actions.RESET_QUERY_PANEL:
            return state.merge({
                codes: [],
                dealerCodes: [],
                dealerName: '',
                marketIds: [],
                status: [],
                createTime: [],
            });
        default:
            return state;
    }
};

const pageTableCondition = (state, action) => {
    switch(action.type) {
        case actions.GET_LIST_DATA_SUCCESS:
            return state.merge(action.condition);
        default:
            return state;
    }
};

const savedBasicInfo = (state, action) => {
    switch(action.type) {
        case actions.CHANGE_DEALER:
        case actions.SAVE_BASIC_DATA:
            return state.merge(action.data);
        case actions.RESET_ADD_DATA:
            return state.clear();
        case actions.GET_DETAIL_SUCCESS: {
            return state.merge({
                code: action.data.code,
                salesOrgName: action.data.salesOrgName,
                fundsTypeId: action.data.fundsTypeId.toString(),
                dealerId: action.data.dealerId,
                dealerCode: action.data.dealerCode,
                dealerName: action.data.dealerName,
                remark: action.data.remark,
                rowVersion: action.data.rowVersion,
                options: action.data.options
            });
        }
        default:
            return state;
    }
};

const orderDetails = (state, action) => {
    switch(action.type) {
        case actions.SAVE_SELECTED_DATA: {
            const data = action.data.map(d => ({
                ...d,
                intention: vehicleOrderPlanDetailIntention.其他,
                shippingMethod: vehicleOrderDetailExtendShippingMethod.物流运输,
                settlementPrice: 0,
                quantity: 0,
                useRebate: false,
                phoneNumber: ''
            }));
            return state.updateIn(['data'], list => list.concat(Immutable.fromJS(data)));
        }
        case actions.UPDATE_DETAIL: {
            const index = state.get('data').findIndex(v => v.get('id') === action.obj.id);
            return state.updateIn(['data', index], obj => obj.merge(action.obj));
        }
        case actions.BATCH_UPDATE: {
            action.ids.forEach(key => {
                const index = state.get('data').findIndex(v => v.get('id') === key);
                state = state.updateIn(['data', index], obj => obj.merge(action.obj));
            });

            return state;
        }
        case actions.CHANGE_SETTLEMENT_PRICE: {
            return state.set('data', Immutable.fromJS(action.data));
        }
        case actions.ROMOVE_DETAIL: {
            if(action.id) {
                /*eslint-disable eqeqeq */
                const index = state.get('data').findIndex(s => s.get('id') == action.id);
                
                if(index === -1)
                    return state;
                return state.deleteIn(['data', index]);
            }
            return state.set('data', Immutable.fromJS([]));
        }
        case actions.CHANGE_DEALER:
        case actions.RESET_ADD_DATA:
            return state.set('data', Immutable.List());
        case actions.GET_DETAIL_SUCCESS: {
            const details = action.data.details.map(d => ({
                id: d.id,
                productCategoryCode: d.productCategoryCode,
                productId: d.productId,
                productCode: d.productCode,
                productName: d.productName,
                productType: d.productType,
                intention: d.vehicleOrderPlanIntention,
                quantity: d.quantity,
                shippingMethod: d.shippingMethod,
                receivingAddressId: d.receivingAddressId,
                receivingAddressCode: d.receivingAddressCode,
                receivingAddress: d.address,
                useRebate: d.useRebate,
                price: d.price,
                settlementPrice: d.settlementPrice,
                phoneNumber: d.phoneNumber,
            }));
            return state.set('data', Immutable.fromJS(details));
        }
        default:
            return state;
    }
};


const uiState = (state, action) => {
    switch(action.type) {
        case actions.SAVE_BASIC_DATA:
        case actions.SAVE_SELECTED_DATA:
        case actions.UPDATE_DETAIL:
        case actions.ROMOVE_DETAIL:
            return state.set('hasWarningForReturn', true);
        case actions.RESET_ADD_DATA:
            return state.set('hasWarningForReturn', false);
        default:
            return state;
    }
};

const domainData = combineReducers({
    initData,
    list
});

const appState = combineReducers({
    queryCondition,
    pageTableCondition,
    savedBasicInfo,
    orderDetails
});

import {createNotificationReducer as notification} from 'Shared/utils/serverNotification';

export default combineReducers({
    domainData,
    appState,
    uiState,
    notification
});


