import state from './state';
import reducers from './reducers';
import AppContainer from './App';
import routes from './routes';
import 'Shared/styles/form.css';
import 'Shared/styles/table.css';
import 'Shared/styles/row-col.css';
import '../../style.css';

export default config => ({
    state,
    reducer: reducers,
    component: AppContainer,
    routes
});
