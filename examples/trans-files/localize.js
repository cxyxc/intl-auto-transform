import defaultLocalize, {getIntlString} from 'Shared/utils/localize';

const getLocalization = (category, language) => require(`./localizations/${category}.${language}.json`);

export const localize = component => defaultLocalize(component, getLocalization);

export const getString = getIntlString('RetailContract.Other', getLocalization);
