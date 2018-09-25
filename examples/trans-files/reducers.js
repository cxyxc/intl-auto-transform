import {combineReducers} from 'redux-immutable';
import Immutable from 'immutable';
import * as actions from './actions';
import difference from 'lodash/difference';
import {GET_CURRENT_USER_PAGE_PERMISSIONS_SUCCESS, GET_CURRENT_USER_PAGE_PERMISSIONS_FAIL} from 'Shared/actions/currentUserContext';
import {jobType} from '../Enum';

const initData = (state, action) => {
    switch(action.type) {
        case actions.GET_INIT_DATA_BEGIN:
            return state.merge({
                isFetching: true,
                consultants: [],
                currentUserInfo: {}
            });
        case actions.GET_INIT_DATA_SUCCESS:
            return state.merge({
                isFetching: false,
                consultants: action.data.consultants,
                currentUserInfo: action.data.currentUserInfo
            });
        case actions.GET_INIT_DATA_FAIL:
            return state.merge({
                isFetching: false,
                consultants: [],
                currentUserInfo: {}
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

const retailContracts = (state, action) => {
    switch(action.type) {
        case actions.GET_LIST_DATA_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
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

const retailContractDetail = (state, action) => {
    switch(action.type) {
        case actions.GET_DETAIL_BEGIN:
            return state.merge({
                isFetching: true,
                data: {}
            });
        case actions.GET_DETAIL_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });
        case actions.GET_DETAIL_FAIL:
            return state.merge({
                isFetching: false,
                data: {}
            });
        default:
            return state;
    }
};

const valueAddeds = (state, action) => {
    switch(action.type) {
        case actions.GET_VALUE_ADDEDS_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
            });
        case actions.GET_VALUE_ADDEDS_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });
        case actions.GET_VALUE_ADDEDS_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};

const retailContractLogs = (state, action) => {
    switch(action.type) {
        case actions.GET_LOGS_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
            });
        case actions.GET_LOGS_SUCCESS:
            return state.merge({
                isFetching: false,
                data: action.data
            });
        case actions.GET_LOGS_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};

const products = (state, action) => {
    switch(action.type) {
        case actions.GET_PRODUCTS_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
            });
        case actions.GET_PRODUCTS_SUCCESS:
            return state.merge({
                isFetching: false,
                total: action.totalElements,
                data: action.data
            });
        case actions.GET_PRODUCTS_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};

const vehicleInventorys = (state, action) => {
    switch(action.type) {
        case actions.GET_VEHICLES_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
            });
        case actions.GET_VEHICLES_SUCCESS:
            return state.merge({
                isFetching: false,
                total: action.totalElements,
                data: action.data
            });
        case actions.SELECT_PRODUCT:
        case actions.SELECT_VEHICLE:
        case actions.CLEAR_VEHICLE:
        case actions.GET_VEHICLES_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};

const valueAddedProducts = (state, action) => {
    switch(action.type) {
        case actions.SEARCH_VALUE_ADDED_BEGIN:
            return state.merge({
                isFetching: true,
                total: 0,
                data: []
            });
        case actions.SEARCH_VALUE_ADDED_SUCCESS:
            return state.merge({
                isFetching: false,
                total: action.totalElements,
                data: action.data
            });
        case actions.RESET_ADD_DATA:
        case actions.SEARCH_VALUE_ADDED_FAIL:
            return state.merge({
                isFetching: false,
                total: 0,
                data: []
            });
        default:
            return state;
    }
};

const appState = (state, action) => {
    switch(action.type) {
        case actions.SAVE_QUERY_CONDITION:
            return state.updateIn(['queryCondition'], obj => obj.merge(action.obj));
        case actions.RESET_QUERY_PANEL:
            return state.updateIn(['queryCondition'], obj => obj.merge({
                customerName: '',
                cellNumber: '',
                status: [],
                consultants: [],
                payStatus: [],
                vin: '',
                createTime: [],
            }));
        case actions.GET_LIST_DATA_SUCCESS:
            return state.updateIn(['pageQueryCondition'], con => con.merge(action.condition));
        case actions.NEXT_STEP:
            return state.updateIn(['currentStep'], currentStep => currentStep + 1);
        case actions.PREV_STEP:
            return state.updateIn(['currentStep'], currentStep => currentStep > 0 ? currentStep - 1 : 0);
        case actions.LAST_STEP:
            return state.updateIn(['currentStep'], currentStep => currentStep + 2);
        case actions.GET_INIT_DATA_SUCCESS: {
            if(action.data.currentUserInfo && (action.data.currentUserInfo.job === jobType.销售顾问 ||
                     action.data.currentUserInfo.job === jobType.销售经理))
                return state.updateIn(['customerInfo'], obj => obj.merge({
                    consultantId: action.data.currentUserInfo.userId
                }));
            return state;
        }
        case actions.SELECT_PRODUCT:
            return state.updateIn(['productInfo'], obj => obj.merge({
                productId: action.data.productId,
                productCode: action.data.productCode,
                productName: action.data.productName,
                vehicleModelName: action.data.vehicleModelName,
                color: action.data.color,
                vin: ''
            }));
        case actions.SELECT_VEHICLE: {
            if(action.data.productId)
                return state.updateIn(['productInfo'], obj => obj.merge({
                    productId: action.data.productId,
                    productCode: action.data.productCode,
                    productName: action.data.productName,
                    vehicleModelName: action.data.vehicleModelName,
                    color: action.data.color,
                    vin: action.data.vin
                }));
            return state.updateIn(['productInfo'], obj => obj.merge({
                vin: action.data.vin
            }));
        }
        case actions.SAVE_ADD_DATA:
            return state.updateIn([action.contentType], obj => obj.merge(action.obj));
        case actions.SAVE_SELECTED_VALUEADDED: {
            const index = state.get('selectedValueAddedIds').findIndex(s => s.get('id') === action.data.id);
            if(index === -1)
                return state.updateIn(['selectedValueAddedIds'], list => list.push(Immutable.fromJS({
                    id: action.data.id,
                    code: action.data.code,
                    name: action.data.name,
                    category: action.data.category,
                    type: action.data.type,
                    amount: action.data.amount,
                    quantity: 1,
                    totalAmount: action.data.amount
                })));
            return state;
        }
        case actions.ROMOVE_VALUEADDED: {
            if(action.id) {
                const index = state.get('selectedValueAddedIds').findIndex(s => s.get('id') === action.id);
                if(index === -1)
                    return state;
                return state.deleteIn(['selectedValueAddedIds', index]);
            }
            return state.set('selectedValueAddedIds', Immutable.fromJS([]));
        }
        case actions.UPDATE_VALUEADDED: {
            const index = state.get('selectedValueAddedIds').findIndex(v => v.get('id') === action.obj.id);
            return state.updateIn(['selectedValueAddedIds', index], obj => obj.merge(action.obj));
        }
        case actions.GET_DETAIL_SUCCESS: {
            const {regionId, provinceId, cityId, districtId, ...other} = action.data;
            const regions = [];
            if(regionId)
                regions.push(regionId);
            if(provinceId)
                regions.push(provinceId);
            if(cityId)
                regions.push(cityId);
            if(districtId)
                regions.push(districtId);
            other.regionId = regions;
            return state.withMutations(map => map.updateIn(['customerInfo'], obj => obj.merge(other)).
                updateIn(['productInfo'], obj => obj.merge({
                    productId: action.data.productId,
                    productCode: action.data.productCode,
                    productName: action.data.productName,
                    vehicleModelName: action.data.vehicleModelName,
                    color: action.data.color,
                    vin: action.data.vin,
                    price: action.data.price,
                    certificateNumber: action.data.certificateNumber,
                })));
        }
        case actions.GET_VALUE_ADDEDS_SUCCESS: {
            const data = action.data.map(d => ({
                id: d.productId,
                code: d.productCode,
                name: d.productName,
                category: d.type,
                isFree: d.isFree,
                quantity: d.quantity,
                discountPrice: d.discountPrice ? d.discountPrice : undefined,
                totalAmount: d.totalAmount,
                amount: d.unitPrice
            }));
            return state.updateIn(['selectedValueAddedIds'], list => list.size > 0 ? list : Immutable.fromJS(data));
        }
        case actions.RESET_ADD_DATA: {
            return state.withMutations(map => map.set('productInfo', Immutable.fromJS({}))
                .set('customerInfo', Immutable.fromJS({}))
                .set('currentStep', 0)
                .set('selectedValueAddedIds', Immutable.List()));
        }
        default:
            return state;
    }
};

const domainData = combineReducers({
    initData,
    retailContractDetail,
    retailContracts,
    valueAddeds,
    retailContractLogs,
    products,
    vehicleInventorys,
    valueAddedProducts
});

import {createNotificationReducer as notification} from 'Shared/utils/serverNotification';

export default combineReducers({
    domainData,
    appState,
    notification
});
