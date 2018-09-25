import {Routes} from 'Shared/utils/routeManager';
import {getString} from './localize';

const routes = {
    query: {
        url: '/',
        title: getString('ROUTE_LIST')
    },
    add: {
        url: '/add',
        title: getString('ROUTE_ADD')
    },
    detail: {
        url: '/:id/detail',
        title: getString('ROUTE_DETAIL'),
        format: '/{0}/detail'
    },
    update: {
        url: '/:id/update',
        title: getString('ROUTE_UPDATE'),
        format: '/{0}/update'
    },
    matchVehicle: {
        url: '/:id/matchVehicle',
        title: getString('ROUTE_MATCH_CAR'),
        format: '/{0}/matchVehicle'
    },
};

export default new Routes(routes);
