import stringify from 'Shared/utils/stringify';
import {NOTIFICATION_TYPE, ERROR_CODE, PAGE} from '../constants';
import {makeApiCall} from '../utils';
import {
    getCurrentUserPagePermissionsBegin,
    getCurrentUserPagePermissionsSuccess,
    getCurrentUserPagePermissionsFail,
    getCurrentUserPagePermissionsApi
} from 'Shared/actions/currentUserContext';
import {dealerStatus} from '../Enum';
import {getString} from './localize';
const baseUrl = '/api/v1';

const isNullOrUndefined = data => {
    if(data === null || typeof data === 'undefined') return true;
    return false;
};
/**初始化 */
// 获取指定页当前用户的权限

export const getCurrentUserPagePermissions = pageCode => dispatch => {
    dispatch(getCurrentUserPagePermissionsBegin(pageCode));
    return getCurrentUserPagePermissionsApi(pageCode).then(data => {
        if(data.isOk) dispatch(getCurrentUserPagePermissionsSuccess(data.data, pageCode));
        else dispatch(getCurrentUserPagePermissionsFail(data.statusCode, data.message, pageCode));
    });
}; // 查询界面

export const MODIFY_QUERY_CONDITION = 'MODIFY_QUERY_CONDITION';
export const modifyQueryCondition = (name, value) => ({
    type: MODIFY_QUERY_CONDITION,
    name,
    value
});
export const REST_QUERY_CONDITION = 'REST_QUERY_CONDITION';
export const restQueryCondition = () => ({
    type: REST_QUERY_CONDITION
});
export const GET_EMPLOYEES_BEGIN = 'GET_EMPLOYEES_BEGIN';
export const GET_EMPLOYEES_SUCCESS = 'GET_EMPLOYEES_SUCCESS';
export const GET_EMPLOYEES_FAIL = 'GET_EMPLOYEES_FAIL';

const getEmployeesBegin = () => ({
    type: GET_EMPLOYEES_BEGIN
});

const getEmployeesSuccess = (data, condition) => ({
    type: GET_EMPLOYEES_SUCCESS,
    data,
    condition
});

const getEmployeesFail = (statusCode, message) => ({
    type: GET_EMPLOYEES_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

const getEmployees = condition => dispatch => {
    const {createTime, ...tmp} = condition;

    if(createTime && createTime.length > 0) {
        tmp.beginCreateTime = createTime[0];
        tmp.endCreateTime = createTime[1];
    }

    const queryCondition = stringify(tmp);
    dispatch(getEmployeesBegin());
    return fetch(`${baseUrl}/employees?${queryCondition}`)
        .then(res => {
            if(res.ok)
                return res.json().then(data => {
                    dispatch(getEmployeesSuccess(data.payload, condition));
                    return true;
                });
            dispatch(getEmployeesFail(res.status, res.statusText));
            return false;
        })
        .catch(error => {
            dispatch(getEmployeesFail(ERROR_CODE, error.message));
            return false;
        });
}; // 查询界面 点击查询按钮

export const onClickSearchEmployeeBtn = () => (dispatch, getState) => {
    const condition = getState()
        .getIn(['page', 'uiState', 'queryPanel'])
        .toJS();
    dispatch(getEmployees(condition));
}; // 查询界面 点击分页按钮

export const onClickPageBtn = page => (dispatch, getState) => {
    let condition = getState()
        .getIn(['page', 'appState', 'queryCondition'])
        .toJS();
    condition = Object.assign({}, condition, page);
    dispatch(getEmployees(condition));
}; // 编辑人员

export const MODIFY_EDIT_INFO = 'MODIFY_EDIT_INFO';
export const modifyEditInfo = (name, value) => ({
    type: MODIFY_EDIT_INFO,
    name,
    value
});
export const UPDATE_EMPLOYEE_BEGIN = 'UPDATE_EMPLOYEE_BEGIN';
export const UPDATE_EMPLOYEE_SUCCESS = 'UPDATE_EMPLOYEE_SUCCESS';
export const UPDATE_EMPLOYEE_FAIL = 'UPDATE_EMPLOYEE_FAIL';

const updateEmployeeBegin = () => ({
    type: UPDATE_EMPLOYEE_BEGIN
});

const updateEmployeeSuccess = () => ({
    type: UPDATE_EMPLOYEE_SUCCESS,
    message: getString('actions.dealerInformationEditSuccess'),
    notificationType: NOTIFICATION_TYPE.success,
    timeStamp: Date.now().toString()
});

const updateEmployeeFail = (statusCode, message) => ({
    type: UPDATE_EMPLOYEE_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

export const updateEmployee = id => (dispatch, getState) => {
    const state = getState();
    const tmpEmployeeInfo = state.getIn(['page', 'appState', 'editInfo']).toJS();
    const requiredField = [];
    if(isNullOrUndefined(tmpEmployeeInfo.sex)) requiredField.push(getString('actions.sex'));
    if(isNullOrUndefined(tmpEmployeeInfo.job)) requiredField.push(getString('actions.businessPost'));
    if(isNullOrUndefined(tmpEmployeeInfo.dealerId)) requiredField.push(getString('actions.branch'));

    if(requiredField.length > 0) {
        dispatch(updateEmployeeFail(null, `${requiredField.join('，')}${getString('actions.required')}`));
        return Promise.resolve(false);
    }

    const employeeInfo = {
        sex: tmpEmployeeInfo.sex,
        job: tmpEmployeeInfo.job,
        dealerId: tmpEmployeeInfo.dealerId,
        jobDescription: tmpEmployeeInfo.jobDescription,
        remark: tmpEmployeeInfo.remark,
        photoId: tmpEmployeeInfo.photoId,
        idNumber: tmpEmployeeInfo.idNumber,
        birthday: tmpEmployeeInfo.birthday,
        nationality: tmpEmployeeInfo.nationality,
        education: tmpEmployeeInfo.education,
        ethnic: tmpEmployeeInfo.ethnic,
        political: tmpEmployeeInfo.political,
        cellNumber: tmpEmployeeInfo.cellNumber,
        phoneNumber: tmpEmployeeInfo.phoneNumber,
        email: tmpEmployeeInfo.email,
        address: tmpEmployeeInfo.address
    };
    return makeApiCall({
        url: `${baseUrl}/employees/${id}`,
        options: {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeInfo)
        },
        onBegin: updateEmployeeBegin,
        onSuccess: updateEmployeeSuccess,
        onFail: updateEmployeeFail,
        dispatch
    });
}; // 查询人员详情

export const GET_EMPLOYEE_DETAIL_BEGIN = 'GET_EMPLOYEE_DETAIL_BEGIN';
export const GET_EMPLOYEE_DETAIL_SUCCESS = 'GET_EMPLOYEE_DETAIL_SUCCESS';
export const GET_EMPLOYEE_DETAIL_FAIL = 'GET_EMPLOYEE_DETAIL_FAIL';

const getEmployeeDetailBegin = () => ({
    type: GET_EMPLOYEE_DETAIL_BEGIN
});

const getEmployeeDetailSuccess = data => ({
    type: GET_EMPLOYEE_DETAIL_SUCCESS,
    data
});

const getEmployeeDetailFail = (statusCode, message) => ({
    type: GET_EMPLOYEE_DETAIL_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

export const getEmployeeDetail = id => dispatch =>
    makeApiCall({
        url: `${baseUrl}/employees/${id}`,
        onBegin: getEmployeeDetailBegin,
        onSuccess: getEmployeeDetailSuccess,
        onFail: getEmployeeDetailFail,
        dispatch
    });
export const CLOSE_EDIT_PANEL = 'CLOSE_EDIT_PANEL';
export const closeEditPanel = () => ({
    type: CLOSE_EDIT_PANEL
}); // 查询经销商

export const GET_DEALERS_BEGIN = 'GET_DEALERS_BEGIN';
export const GET_DEALERS_SUCCESS = 'GET_DEALERS_SUCCESS';
export const GET_DEALERS_FAIL = 'GET_DEALERS_FAIL';

const getDealersBegin = () => ({
    type: GET_DEALERS_BEGIN
});

const getDealersSuccess = data => ({
    type: GET_DEALERS_SUCCESS,
    data: (data && data.content) || []
});

const getDealersFail = (statusCode, message) => ({
    type: GET_DEALERS_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

export const getDealers = () => (dispatch, getState) => {
    const state = getState();
    const isHaveRequested = state.getIn(['page', 'domainData', 'dealers', 'data']).size > 0;
    if(isHaveRequested) return Promise.resolve(true);
    const condition = {
        pageSize: 100,
        status: dealerStatus.有效
    };
    const queryCondition = stringify(condition);
    return makeApiCall({
        url: `${baseUrl}/dealers?${queryCondition}`,
        onBegin: getDealersBegin,
        onSuccess: getDealersSuccess,
        onFail: getDealersFail,
        dispatch
    });
}; // 查询当前企业所有有效人员及人员关系

export const GET_ALL_EMPLOYEES_BEGIN = 'GET_ALL_EMPLOYEES_BEGIN';
export const GET_ALL_EMPLOYEES_SUCCESS = 'GET_ALL_EMPLOYEES_SUCCESS';
export const GET_ALL_EMPLOYEES_FAIL = 'GET_ALL_EMPLOYEES_FAIL';

const getAllEmployeesBegin = () => ({
    type: GET_ALL_EMPLOYEES_BEGIN
});

const emptyGuid = '00000000-0000-0000-0000-000000000000';

const clearUpRelations = (relations, employees) => {
    const result = relations.reduce((result, item) => {
        if(
            employees.findIndex(employee => employee.userId === item.userId) >= 0 &&
            (item.parentId === emptyGuid || relations.findIndex(r => r.userId === item.parentId) >= 0)
        )
            result.push(item);
        return result;
    }, []);
    if(result.length === relations.length) return relations;
    return clearUpRelations(result, employees);
};

const getAllEmployeesSuccess = data => ({
    type: GET_ALL_EMPLOYEES_SUCCESS,
    data: {
        employees: data.employees,
        relations: clearUpRelations(data.relations, data.employees)
    }
});

const getAllEmployeesFail = (statusCode, message) => ({
    type: GET_ALL_EMPLOYEES_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

export const getAllEmployees = () => dispatch =>
    makeApiCall({
        url: `${baseUrl}/employees/all`,
        onBegin: getAllEmployeesBegin,
        onSuccess: getAllEmployeesSuccess,
        onFail: getAllEmployeesFail,
        dispatch
    }); // 修改人员关系

export const ADD_RELATION = 'ADD_RELATION';
export const addRelation = (userId, parentId) => ({
    type: ADD_RELATION,
    userId,
    parentId
});
export const DELETE_RELATION = 'DELETE_RELATION';
export const deleteRelation = userId => ({
    type: DELETE_RELATION,
    userId
}); //修改拖拽树的展开，选中情况

export const MODIFY_DRAG_TREE_STATE = 'MODIFY_DRAG_TREE_STATE';
export const modifyDragTreeState = data => ({
    type: MODIFY_DRAG_TREE_STATE,
    data
}); // 提交人员关系信息

export const SUBMIT_RELATION_INFO_BEGIN = 'SUBMIT_RELATION_INFO_BEGIN';
export const SUBMIT_RELATION_INFO_SUCCESS = 'SUBMIT_RELATION_INFO_SUCCESS';
export const SUBMIT_RELATION_INFO_FAIL = 'SUBMIT_RELATION_INFO_FAIL';

const submitRelationInfoBegin = () => ({
    type: SUBMIT_RELATION_INFO_BEGIN
});

const submitRelationInfoSuccess = () => ({
    type: SUBMIT_RELATION_INFO_SUCCESS,
    message: getString('actions.dealerRelationEditSuccess'),
    notificationType: NOTIFICATION_TYPE.success,
    timeStamp: Date.now().toString()
});

const submitRelationInfoFail = (statusCode, message) => ({
    type: SUBMIT_RELATION_INFO_FAIL,
    statusCode,
    message,
    notificationType: NOTIFICATION_TYPE.error,
    timeStamp: Date.now().toString()
});

export const submitRelationInfo = () => (dispatch, getState) => {
    const state = getState();
    const relations = state.getIn(['page', 'appState', 'relations']).toJS();
    const data = {
        relations
    };
    return makeApiCall({
        url: `${baseUrl}/employees/relations`,
        options: {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        },
        onBegin: submitRelationInfoBegin,
        onSuccess: submitRelationInfoSuccess,
        onFail: submitRelationInfoFail,
        dispatch
    });
}; // 关闭编辑

export const CLOSE_EDIT_RELATION_PANEL = 'CLOSE_EDIT_RELATION_PANEL';
export const closeEditRelationPanel = () => ({
    type: CLOSE_EDIT_RELATION_PANEL
});
export const CLOSE_DETAIL_PANEL = 'CLOSE_DETAIL_PANEL';
export const closeDetailPanel = () => ({
    type: CLOSE_DETAIL_PANEL
});
