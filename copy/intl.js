import {Intl} from '@shsdt/web-intl';

const intl = new Intl(language => require(`./localizations/${language}.json`));

export const injectIntl = intl.inject;

export const formatMessage = intl.formatMessage;
