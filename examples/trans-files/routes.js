import {Routes} from 'Shared/utils/routeManager';
import {getString} from './localize';

const routes = {
    query: {
        url: '/',
        title: getString('INDEX')
    },
    update: {
        url: '/:id/edit',
        title: getString('EDIT'),
        format: '/{0}/edit'
    },
    detail: {
        url: '/:id/detail',
        title: getString('DETAIL'),
        format: '/{0}/detail'
    },
    updateRelation: {
        url: '/updateRelation',
        title: getString('UPDATE_RELATION')
    }
};

export default new Routes(routes);
