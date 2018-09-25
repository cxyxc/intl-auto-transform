import {PAGE} from '../constants';
const emptyGuid = '00000000-0000-0000-0000-000000000000';
import {employeeStatus} from '../Enum';
const state = {
    domainData: {
        // 页面权限
        permissions: {
            isFetching: false,
            message: '',
            data: []
        },
        employees: {
            isFetching: false,
            message: '',
            data: {}
        },
        employeeDetail: {
            isFetching: false,
            message: '',
            data: {}
        },
        dealers: {
            isFetching: false,
            message: '',
            data: []
        },
        employeeAndRelation: {
            isFetching: false,
            message: '',
            data: {
                employees: [],
                relations: []
            }
        },
        submitEditInfo: {
            isFetching: false,
            message: ''
        },
        submitEditRelationInfo: {
            isFetching: false,
            message: ''
        }
    },
    appState: {
        queryCondition: {
        },
        // 编辑人员信息
        editInfo: {
        },
        // 人员关系
        relations: []
    },
    uiState: {
        queryPanel: {
            username: '',
            name: '',
            job: [],
            status: employeeStatus.有效,
            phoneNumber: '',
            createTime: [],
            pageIndex: PAGE.index,
            pageSize: PAGE.size,
            sortField: undefined,
            isDesc: undefined
        },
        droggableTree: {
            expandedKeys: [emptyGuid],
            selectedKeys: [],
            autoExpandParent: true
        }
    },
    notification: {}
};

export default state;
