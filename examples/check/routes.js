import {Routes} from 'Shared/utils/routeManager';
import {getString} from './localize';
const routes = {
    query: {
        url: '/',
        title: getString('routes.index')
    },
    update: {
        url: '/:id/edit',
        title: getString('routes.edit'),
        format: '/{0}/edit'
    },
    detail: {
        url: '/:id/detail',
        title: getString('routes.detail'),
        format: '/{0}/detail'
    },
    updateRelation: {
        url: '/updateRelation',
        title: getString('routes.updateRelation')
    }
};
export default new Routes(routes);
