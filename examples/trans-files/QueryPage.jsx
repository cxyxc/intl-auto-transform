import React from 'react';
import PropTypes from 'prop-types';
import QueryPanel from './QueryPanel';
import DataTablePanel from './DataTablePanel';
import styles from './style.css';

const QueryPage = ({history}) => (
    <div>
        <div className={styles.card_margin}>
            <QueryPanel />
        </div>
        <div className={styles.card_margin}>
            <DataTablePanel history={history} />
        </div>
    </div>
);

QueryPage.propTypes = {
    history: PropTypes.object.isRequired
};
export default QueryPage;
