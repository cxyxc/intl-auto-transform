import {PAGE} from '../constants';
const state = {
    domainData: {
        initData: {
            isFetching: false,
            errorCode: '',
            message: '',
            currentUserInfo: {},
            consultants: [],
            permissions: []
        },
        // 指定零售合同的详情信息
        retailContractDetail: {
            isFetching: false,
            errorCode: '',
            message: '',
            data: {}
        },
        // 查询界面的列表数据
        retailContracts: {
            isFetching: false,
            errorCode: '',
            message: '',
            total: 0,
            data: []
        },
        // 指定零售单包括的增值业务服务集合
        valueAddeds: {
            isFetching: false,
            errorCode: '',
            message: '',
            total: 0,
            data: []
        },
        // 指定零售单的操作日志集合
        retailContractLogs: {
            isFetching: false,
            errorCode: '',
            message: '',
            total: 0,
            data: []
        },
        // 界面上搜索到的产品集合
        products: {
            isFetching: false,
            total: 0,
            data: []
        },
        // 界面上搜索到的车辆库存集合
        vehicleInventorys: {
            isFetching: false,
            total: 0,
            data: []
        },
        // 界面上搜索到的商品
        valueAddedProducts: {
            isFetching: false,
            total: 0,
            data: []
        },
    },
    appState: {
        // 查询面板的条件
        queryCondition: {
            customerName: '',
            cellNumber: '',
            status: [],
            consultants: [],
            payStatus: [],
            vin: '',
            createTime: [],
            pageIndex: PAGE.index,
            pageSize: PAGE.size,
            sortBy: '',
            sortOrder: 'descend',
        },
        // 查询界面的分页条件
        pageQueryCondition: {},
        // 新增，修改，配车操作保存的界面数据
        customerInfo: {},
        productInfo: {},
        selectedValueAddedIds: [],
        // 分步显示的当前步骤
        currentStep: 0,
    },
    notification: {}
};

export default state;
