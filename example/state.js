import {PAGE} from '../../constants';
const state = {
    domainData: {
        initData: {
            isFetching: false,
            marketingDepartments: [],
            branch: {},
            distributionChannel: {},
            vehicleSalesOrganization: {},
            fundsTypes: [],
            permissions: []
        },
        list: {
            isFetching: false,
            total: 0,
            data: []
        },
    },
    appState: {
        queryCondition: {
            codes: [],
            dealerCodes: [],
            dealerName: '',
            marketIds: [],
            status: [],
            createTime: [],
            pageIndex: PAGE.index,
            pageSize: PAGE.size,
            sortBy: '',
            sortOrder: 'descend'
        },
        pageTableCondition: {},
        savedBasicInfo: {},
        orderDetails: {data: []},
    },
    uiState: {
        hasWarningForReturn: false
    },
    notification: {},
};

export default state;
