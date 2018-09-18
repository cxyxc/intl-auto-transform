import {Routes} from 'Shared/utils/routeManager';

const routes = new Routes({
    query: {
        url: '/',
        title: '查询'
    },
    add: {
        url: '/add',
        title: '新增'
    },
    detail: {
        url: '/:id/detail',
        title: '详情',
        format: '/{0}/detail'
    },
    update: {
        url: '/:id/update',
        title: '更新',
        format: '/{0}/update'
    }
});

export default routes;
