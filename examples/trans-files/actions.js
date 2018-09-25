const baseUrl = '/api/v1';
import stringify from 'Shared/utils/stringify';
import {ERROR_CODE, PAGE} from '../constants';
import {PAGE_CODE} from './constants';
import {getCurrentUserPagePermissionsApi, getCurrentUserPagePermissionsFail, getCurrentUserPagePermissionsSuccess} from 'Shared/actions/currentUserContext';
import {createNotificationAction} from 'Shared/utils/serverNotification';
import {getProductCategories, getVehicles, getValueAddedProducts} from '../common/fetchAPI.js';
import sum from 'lodash/sum';
import {getString} from './localize';

export const SAVE_QUERY_CONDITION = 'SAVE_QUERY_CONDITION';
export const saveQueryCondition = obj => ({
    type: SAVE_QUERY_CONDITION,
    obj
});

export const RESET_QUERY_PANEL = 'RESET_QUERY_PANEL';
export const resetQueryPanel = () => ({
    type: RESET_QUERY_PANEL
});


export const SAVE_ADD_DATA = 'SAVE_ADD_DATA';
export const saveAddData = (obj, contentType) => ({
    type: SAVE_ADD_DATA,
    obj,
    contentType
});

export const RESET_ADD_DATA = 'RESET_ADD_DATA';
export const resetAddPanel = () => ({
    type: RESET_ADD_DATA
});

export const GET_INIT_DATA_BEGIN = 'GET_INIT_DATA_BEGIN';
export const GET_INIT_DATA_SUCCESS = 'GET_INIT_DATA_SUCCESS';
export const GET_INIT_DATA_FAIL = 'GET_INIT_DATA_FAIL';

const getInitDataBegin = () => ({
    type: GET_INIT_DATA_BEGIN
});

const getInitDataSuccess = data => ({
    type: GET_INIT_DATA_SUCCESS,
    data
});

const getInitDataFail = createNotificationAction(message => ({
    type: GET_INIT_DATA_FAIL,
    message
}));

export const getInitData = () => dispatch => {
    dispatch(getInitDataBegin());
    const init = fetch(`${baseUrl}/ui/retailContract/init`).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(getInitDataFail(`${res.status}:${res.statusText}`, res.status));
            return false;
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(getInitDataSuccess(data.payload));
                return true;
            }
            dispatch(getInitDataFail(`${data.errorCode}:${data.message}`, res.status));
            return false;
        });
    }).catch(error => {
        dispatch(getInitDataFail(error.message, ERROR_CODE));
        return false;
    });
    const permissions = getCurrentUserPagePermissionsApi(PAGE_CODE).then(res => {
        if(res.isOk)
            dispatch(getCurrentUserPagePermissionsSuccess(res.data));
        else
            dispatch(getCurrentUserPagePermissionsFail(res.statusCode, res.message));
        return res.isOk;
    });
    return Promise.all([init, permissions]).then(values => values[0] && values[1]);
};

export const GET_LIST_DATA_BEGIN = 'GET_LIST_DATA_BEGIN';
export const GET_LIST_DATA_SUCCESS = 'GET_LIST_DATA_SUCCESS';
export const GET_LIST_DATA_FAIL = 'GET_LIST_DATA_FAIL';

const getListDataBegin = () => ({
    type: GET_LIST_DATA_BEGIN
});

const getListDataSuccess = (condition, data) => ({
    type: GET_LIST_DATA_SUCCESS,
    condition,
    data
});

const getListDataFail = createNotificationAction(message => ({
    type: GET_LIST_DATA_FAIL,
    message
}));


const getListData = condition => {
    let isDesc = undefined;
    if(condition.sortOrder && condition.sortBy)
        isDesc = condition.sortOrder === 'descend';

    const queryCondition = {
        customerName: condition && condition.customerName ? condition.customerName : '',
        cellNumber: condition && condition.cellNumber ? condition.cellNumber : '',
        status: condition && condition.status ? condition.status : '',
        consultantId: condition && condition.consultants ? condition.consultants : '',
        payStatus: condition && condition.payStatus ? condition.payStatus : '',
        vin: condition && condition.vin ? condition.vin : '',
        beginCreateTime: condition && condition.createTime && condition.createTime[0] ? condition.createTime[0].toISOString() : null,
        endCreateTime: condition && condition.createTime && condition.createTime[1] ? condition.createTime[1].toISOString() : null,
        pageIndex: condition.pageIndex,
        pageSize: condition.pageSize,
        sortField: condition.sortBy,
        isDesc
    };
    const str = stringify(queryCondition);

    return fetch(`${baseUrl}/retailContracts?${str}`).then(res => {
        if(!res.ok && res.status !== 400)
            return Promise.resolve({
                success: false,
                errorCode: res.status,
                message: res.statusText
            });

        return res.json().then(data => {
            if(res.ok)
                return Promise.resolve({
                    success: true,
                    data: data.payload
                });

            return Promise.resolve({
                success: false,
                errorCode: res.status,
                message: `${data.errorCode}:${data.message}`
            });
        });
    }).catch(error => Promise.resolve({
        success: false,
        errorCode: ERROR_CODE,
        message: error.message
    }));
};

export const searchList = con => (dispatch, getState) => {
    let condition = getState().getIn(['page', 'appState', 'queryCondition']).toJS();
    const pageSize = getState().getIn(['page', 'appState', 'pageQueryCondition', 'pageSize']);
    condition.pageSize = pageSize || PAGE.size;
    if(con)
        condition = Object.assign({}, condition, con);
    dispatch(getListDataBegin());
    return getListData(condition).then(result => {
        if(result && result.success)
            dispatch(getListDataSuccess(condition, result.data));
        else
            dispatch(getListDataFail(result.message, result.errorCode));
    });
};

export const refreshList = () => (dispatch, getState) => {
    dispatch(getListDataBegin());
    const state = getState();
    const condition = state.getIn(['page', 'appState', 'pageQueryCondition']).toJS();

    return getListData(condition).then(result => {
        if(result && result.success)
            dispatch(getListDataSuccess(condition, result.data));
        else
            dispatch(getListDataFail(result.message, result.errorCode));
    });
};

export const onPageChangeForGetList = pageIndex => (dispatch, getState) => {
    dispatch(getListDataBegin());
    const state = getState();
    const condition = state.getIn(['page', 'appState', 'pageQueryCondition']).toJS();

    const newCondition = Object.assign({}, condition, {pageIndex});
    return getListData(newCondition).then(result => {
        if(result && result.success)
            dispatch(getListDataSuccess(newCondition, result.data));
        else
            dispatch(getListDataFail(result.message, result.errorCode));
    });
};

export const onPageSizeChangeForGetList = pageSize => (dispatch, getState) => {
    dispatch(getListDataBegin());
    const state = getState();
    const condition = state.getIn(['page', 'appState', 'pageQueryCondition']).toJS();
    const newCondition = Object.assign({}, condition, {
        page: PAGE.index,
        pageSize
    });
    return getListData(newCondition).then(result => {
        if(result && result.success)
            dispatch(getListDataSuccess(newCondition, result.data));
        else
            dispatch(getListDataFail(result.message, result.errorCode));
    });
};


export const GET_DETAIL_BEGIN = 'GET_DETAIL_BEGIN';
export const GET_DETAIL_SUCCESS = 'GET_DETAIL_SUCCESS';
export const GET_DETAIL_FAIL = 'GET_DETAIL_FAIL';

const getDetailBegin = () => ({
    type: GET_DETAIL_BEGIN
});

const getDetailSuccess = data => ({
    type: GET_DETAIL_SUCCESS,
    data
});

const getDetailFail = createNotificationAction(message => ({
    type: GET_DETAIL_FAIL,
    message,
}));

export const getDetail = id => dispatch => {
    dispatch(getDetailBegin());
    return fetch(`${baseUrl}/retailContracts/${id}`).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(getDetailFail(res.statusText, res.status));
            return false;
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(getDetailSuccess(data.payload));
                return true;
            }

            dispatch(getDetailFail(`${data.errorCode}:${data.message}`, res.status));
            return false;
        });
    }).catch(error => {
        dispatch(getDetailFail(error.message, ERROR_CODE));
        return false;
    });
};

export const NEW_BEGIN = 'NEW_BEGIN';
export const NEW_SUCCESS = 'NEW_SUCCESS';
export const NEW_FAIL = 'NEW_FAIL';

const newBegin = () => ({
    type: NEW_BEGIN
});

const newSuccess = createNotificationAction(message => ({
    type: NEW_SUCCESS,
    message
}));

const newFail = createNotificationAction(message => ({
    type: NEW_FAIL,
    message
}));

export const submit = id => (dispatch, getState) => {
    const customerInfo = getState().getIn(['page', 'appState', 'customerInfo']).toJS();
    const productInfo = getState().getIn(['page', 'appState', 'productInfo']).toJS();
    const selectedValueAddedIds = getState().getIn(['page', 'appState', 'selectedValueAddedIds']).toJS();
    const emptyErrors = [];
    const valueAddedQuantityError = [];
    if(!customerInfo || !customerInfo.customerName)
        emptyErrors.push(getString('CUSTOMER_NAME'));
    if(!customerInfo || !customerInfo.cellNumber)
        emptyErrors.push(getString('CELLNUMBER'));
    if(!customerInfo || !customerInfo.customerType)
        emptyErrors.push(getString('CUSTOMER_TYPE'));
    if(!customerInfo || !customerInfo.sex)
        emptyErrors.push(getString('SEX'));
    if(!customerInfo || customerInfo.credentialType === undefined)
        emptyErrors.push(getString('CREDENTIAL_TYPE'));
    if(!customerInfo || !customerInfo.credentialNumber)
        emptyErrors.push(getString('CREDENTIAL_NUMBER'));
    if(!customerInfo || !customerInfo.regionId)
        emptyErrors.push(getString('REGION'));
    if(!productInfo || !productInfo.productId)
        emptyErrors.push(getString('PRODUCT'));
    if(!productInfo || customerInfo.payMethod === undefined)
        emptyErrors.push(getString('PAYMETHOD'));
    if(!productInfo || !productInfo.price)
        emptyErrors.push(getString('PRICE'));
    selectedValueAddedIds.forEach(selected => {
        if(!selected.quantity)
            valueAddedQuantityError.push(`${selected.code}|${selected.name}`);
    });
    if(emptyErrors.length > 0 || valueAddedQuantityError.length > 0)
        return Promise.resolve({
            success: false,
            emptyErrors,
            valueAddedQuantityError
        });

    const valueAddedDetails = selectedValueAddedIds.map(selected => ({
        productId: selected.id,
        isFree: Boolean(selected.isFree),
        discountPrice: selected.discountPrice,
        quantity: selected.quantity || 0
    }));

    const valueAddedAmout = sum(selectedValueAddedIds.map(record => !record.isFree && record.quantity && record.discountPrice ? record.quantity * record.discountPrice : 0));
    const totalAmount = productInfo.price ? valueAddedAmout + productInfo.price : valueAddedAmout;

    const data = {
        customerName: customerInfo.customerName,
        cellNumber: customerInfo.cellNumber,
        customerType: customerInfo.customerType,
        sex: customerInfo.sex,
        credentialType: customerInfo.credentialType,
        credentialNumber: customerInfo.credentialNumber,
        weChat: customerInfo.weChat,
        regionId: customerInfo.regionId[customerInfo.regionId.length - 1],
        detailAddress: customerInfo.detailAddress,
        driverName: customerInfo.driverName,
        driverPhoneNumber: customerInfo.driverPhoneNumber,
        productId: productInfo.productId,
        certificateNumber: productInfo.certificateNumber,
        vin: productInfo.vin ? productInfo.vin : '',
        price: productInfo.price,
        valueAdded: valueAddedAmout,
        totalAmount,
        payMethod: customerInfo.payMethod,
        loanChannel: customerInfo.loanChannel,
        advanceDeposit: customerInfo.advanceDeposit,
        consultantId: customerInfo.consultantId,
        valueAddedDetails
    };

    const url = id ? `${baseUrl}/retailContracts/${id}` : `${baseUrl}/retailContracts`;
    const method = id ? 'PUT' : 'POST';
    dispatch(newBegin());
    return fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(newFail(res.statusText, res.status));
            return {
                success: false,
            };
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(newSuccess(getString('SUBMIT_SUCCESS'), res.status));
                return {
                    success: true,
                };
            }
            dispatch(newFail(data.message, res.status));
            return {
                success: false,
            };
        });
    }).catch(error => {
        dispatch(newFail(error.message, ERROR_CODE));
        return {
            success: false,
        };
    });
};

export const UPDATE_STATUS_BEGIN = 'UPDATE_STATUS_BEGIN';
export const UPDATE_STATUS_SUCCESS = 'UPDATE_STATUS_SUCCESS';
export const UPDATE_STATUS_FAIL = 'UPDATE_STATUS_FAIL';

const updateStatusBegin = () => ({
    type: UPDATE_STATUS_BEGIN
});

const updateStatusSuccess = createNotificationAction(message => ({
    type: UPDATE_STATUS_SUCCESS,
    message
}));

const updateStatusFail = createNotificationAction(message => ({
    type: UPDATE_STATUS_FAIL,
    message
}));

const updateStatus = (url, dispatch, bodyArgs) => {
    dispatch(updateStatusBegin());
    return fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bodyArgs)
    }).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(updateStatusFail(res.statusText, res.status));
            return {
                success: false
            };
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(updateStatusSuccess(getString('SUBMIT_SUCCESS'), res.status));
                return {
                    success: true
                };
            }
            dispatch(updateStatusFail(data.message, res.status));
            return {
                success: false
            };
        });
    }).catch(error => {
        dispatch(updateStatusFail(error.message, ERROR_CODE));
        return {
            success: false
        };
    });
};

export const matchVehicle = id => (dispatch, getState) => {
    const vin = getState().getIn(['page', 'appState', 'productInfo', 'vin']);
    const emptyErrors = [];
    if(!vin)
        emptyErrors.push('vin');
    if(emptyErrors.length > 0)
        return Promise.resolve({
            success: false,
            emptyErrors
        });
    const url = `${baseUrl}/retailContracts/${id}/matchVehicle`;
    const data = {
        vin
    };
    return updateStatus(url, dispatch, data);
};

export const pay = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/pay`;
    return updateStatus(url, dispatch);
};

export const cancelPickUp = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/cancelPickUp`;
    return updateStatus(url, dispatch);
};

export const cancelSettle = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/cancelSettle`;
    return updateStatus(url, dispatch);
};

export const cancelOrder = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/cancelOrder`;
    return updateStatus(url, dispatch);
};

export const returnVehicle = (id, reason) => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/returnVehicle`;
    const data = {
        reason
    };
    return updateStatus(url, dispatch, data);
};

export const pickUp = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/pickUp`;
    return updateStatus(url, dispatch);
};

export const settle = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/settle`;
    return updateStatus(url, dispatch);
};

export const issueReceipt = id => dispatch => {
    const url = `${baseUrl}/retailContracts/${id}/issueReceipt`;
    return updateStatus(url, dispatch);
};

export const GET_LOGS_BEGIN = 'GET_LOGS_BEGIN';
export const GET_LOGS_SUCCESS = 'GET_LOGS_SUCCESS';
export const GET_LOGS_FAIL = 'GET_LOGS_FAIL';

const getLogsBegin = () => ({
    type: GET_LOGS_BEGIN
});

const getLogsSuccess = data => ({
    type: GET_LOGS_SUCCESS,
    data
});

const getLogsFail = createNotificationAction(message => ({
    type: GET_LOGS_FAIL,
    message,
}));

export const getLogs = id => dispatch => {
    dispatch(getLogsBegin());
    return fetch(`${baseUrl}/retailContracts/${id}/logs`).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(getLogsFail(res.statusText, res.status));
            return false;
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(getLogsSuccess(data.payload.content || []));
                return true;
            }

            dispatch(getLogsFail(`${data.errorCode}:${data.message}`, res.status));
            return false;
        });
    }).catch(error => {
        dispatch(getLogsFail(error.message, ERROR_CODE));
        return false;
    });
};

export const GET_VALUE_ADDEDS_BEGIN = 'GET_VALUE_ADDEDS_BEGIN';
export const GET_VALUE_ADDEDS_SUCCESS = 'GET_VALUE_ADDEDS_SUCCESS';
export const GET_VALUE_ADDEDS_FAIL = 'GET_VALUE_ADDEDS_FAIL';

const getValueAddedsBegin = () => ({
    type: GET_VALUE_ADDEDS_BEGIN
});

const getValueAddedsSuccess = data => ({
    type: GET_VALUE_ADDEDS_SUCCESS,
    data
});

const getValueAddedsFail = createNotificationAction(message => ({
    type: GET_VALUE_ADDEDS_FAIL,
    message,
}));

export const getValueAddeds = id => dispatch => {
    dispatch(getValueAddedsBegin());
    return fetch(`${baseUrl}/retailContracts/${id}/valueAddeds`).then(res => {
        if(!res.ok && res.status !== 400) {
            dispatch(getValueAddedsFail(res.statusText, res.status));
            return false;
        }
        return res.json().then(data => {
            if(res.ok) {
                dispatch(getValueAddedsSuccess(data.payload.content || []));
                return true;
            }

            dispatch(getValueAddedsFail(`${data.errorCode}:${data.message}`, res.status));
            return false;
        });
    }).catch(error => {
        dispatch(getValueAddedsFail(error.message, ERROR_CODE));
        return false;
    });
};

export const GET_PRODUCTS_BEGIN = 'GET_PRODUCTS_BEGIN';
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAIL = 'GET_PRODUCTS_FAIL';

const getProductsBegin = () => ({
    type: GET_PRODUCTS_BEGIN
});

const getProductsSuccess = (data, totalElements) => ({
    type: GET_PRODUCTS_SUCCESS,
    data,
    totalElements
});

const getProductsFail = createNotificationAction(message => ({
    type: GET_PRODUCTS_FAIL,
    message
}));

export const searchProducts = condition => dispatch => {
    dispatch(getProductsBegin());
    return getProductCategories(condition).then(result => {
        if(result && result.success)
            dispatch(getProductsSuccess(result.data.content, result.data.totalElements));
        else
            dispatch(getProductsFail(result.message, result.errorCode));
    });
};

export const searchProductsForSelect = condition => dispatch => getProductCategories(condition).then(result => {
    if(result && result.success) {
        const data = result.data.content
            ? result.data.content : [];
        return data;
    }
    return [];
});

export const GET_VEHICLES_BEGIN = 'GET_VEHICLES_BEGIN';
export const GET_VEHICLES_SUCCESS = 'GET_VEHICLES_SUCCESS';
export const GET_VEHICLES_FAIL = 'GET_VEHICLES_FAIL';

const getVehiclesBegin = () => ({
    type: GET_VEHICLES_BEGIN
});

const getVehiclesSuccess = (data, totalElements) => ({
    type: GET_VEHICLES_SUCCESS,
    data,
    totalElements
});

const getVehiclesFail = createNotificationAction(message => ({
    type: GET_VEHICLES_FAIL,
    message
}));

export const searchVehicles = condition => dispatch => {
    dispatch(getVehiclesBegin());
    return getVehicles(condition).then(result => {
        if(result && result.success) {
            let content = [];
            if(result.data.content)
                content = result.data.content.map(d => ({
                    vin: d.vin,
                    vehicleModelName: d.vehicleModelName,
                    productId: d.productId,
                    productCode: d.productCode,
                    productName: d.productName,
                    color: d.color,
                    age: d.age,
                    returnTimes: d.returnTimes
                }));
            dispatch(getVehiclesSuccess(content, result.data.totalElements));
        } else
            dispatch(getVehiclesFail(result.message, result.errorCode));
    });
};

export const searchVehiclesForSelect = condition => dispatch => getVehicles(condition).then(result => {
    if(result && result.success) {
        let content = [];
        if(result.data.content)
            content = result.data.content.map(d => ({
                vin: d.vin,
                vehicleModelName: d.vehicleModelName,
                productId: d.productId,
                productCode: d.productCode,
                productName: d.productName,
                color: d.color,
                age: d.age
            }));
        return content;
    }
    return [];
});

export const NEXT_STEP = 'NEXT_STEP';
export const nextStep = () => ({
    type: NEXT_STEP
});

export const PREV_STEP = 'PREV_STEP';
export const prevStep = () => ({
    type: PREV_STEP
});

export const LAST_STEP = 'LAST_STEP';
export const lastStep = () => ({
    type: LAST_STEP
});

export const SELECT_PRODUCT = 'SELECT_PRODUCT';
export const selectProduct = data => ({
    type: SELECT_PRODUCT,
    data
});

export const SELECT_VEHICLE = 'SELECT_VEHICLE';
export const selectVehicle = data => ({
    type: SELECT_VEHICLE,
    data
});

export const CLEAR_VEHICLE = 'CLEAR_VEHICLE';
export const clearVehicle = () => ({
    type: CLEAR_VEHICLE,
});

export const SEARCH_VALUE_ADDED_BEGIN = 'SEARCH_VALUE_ADDED_BEGIN';
export const SEARCH_VALUE_ADDED_SUCCESS = 'SEARCH_VALUE_ADDED_SUCCESS';
export const SEARCH_VALUE_ADDED_FAIL = 'SEARCH_VALUE_ADDED_FAIL';

const searchValueAddedsBegin = () => ({
    type: SEARCH_VALUE_ADDED_BEGIN
});

const searchValueAddedsSuccess = (data, totalElements) => ({
    type: SEARCH_VALUE_ADDED_SUCCESS,
    data,
    totalElements
});

const searchValueAddedsFail = createNotificationAction(message => ({
    type: SEARCH_VALUE_ADDED_FAIL,
    message
}));

export const searchValueAddeds = condition => dispatch => {
    dispatch(searchValueAddedsBegin());
    return getValueAddedProducts(condition).then(result => {
        if(result && result.success)
            dispatch(searchValueAddedsSuccess(result.data.content, result.data.totalElements));
        else
            dispatch(searchValueAddedsFail(result.message, result.errorCode));
    });
};

export const SAVE_SELECTED_VALUEADDED = 'SAVE_SELECTED_VALUEADDED';
export const saveSelectedValueAdded = data => ({
    type: SAVE_SELECTED_VALUEADDED,
    data
});


export const UPDATE_VALUEADDED = 'UPDATE_VALUEADDED';
export const updateValueAdded = obj => ({
    type: UPDATE_VALUEADDED,
    obj
});

export const ROMOVE_VALUEADDED = 'ROMOVE_VALUEADDED';
export const removeValueAdded = id => ({
    type: ROMOVE_VALUEADDED,
    id,
});
