import {customeStruct} from '../../utils';

const itf = customeStruct.interface;

export const InitData = itf({
    payload: itf({
        vehicleSalesOrganization: itf({
            id: 'number',
            code: 'string',
        }),
        branch: itf({
            id: 'number',
            name: 'string',
            code: 'string'
        }),
        distributionChannel: itf({
            id: 'number',
            name: 'string',
            code: 'string'
        }),
        marketingDepartments: [itf({
            id: 'number',
            name: 'string',
        })],
        fundsTypes: [itf({
            id: 'number',
            name: 'string',
        })],
    })
});


const defaultData = {
    id: 'number',
    code: 'string',
    status: 'number',
    rowVersion: 'string?|null',
    options: [
        'string'
    ]
};
export const ListData = itf({
    payload: itf({
        content: [itf(defaultData)],
        totalElements: 'number'
    })
});

export const DetailData = itf({
    payload: itf({
        ...defaultData,
        details: [itf({
            id: 'number',
            productId: 'number',
            productCode: 'string',
        })]
    })
});


export const VehicleAdditionalResourceData = itf({
    payload: itf({
        content: [itf({
            productCategoryCode: 'string',
            productCategoryName: 'string',
            productId: 'number',
            productCode: 'string',
            productName: 'string',
            productType: 'string',
        })],
        totalElements: 'number'
    })
});


const defaultReceivingAddresse = {
    id: 'number',
    code: 'string',
    name: 'string',
    address: 'string'
};
export const ReceivingAddresseData = itf({
    payload: itf({
        content: [itf(defaultReceivingAddresse)],
        totalElements: 'number'
    })
});


export const SimpleReceivingAddresseData = itf({
    payload: itf({
        content: [itf(defaultReceivingAddresse)]
    })
});


export const SettlementPriceData = itf({
    payload: [itf({
        productCode: 'string',
        price: 'number'
    })]
});


export const EditDetailData = itf({
    payload: itf({
        id: 'number',
        code: 'string',
        rowVersion: 'string?|null',
        options: [
            'string'
        ],
        details: [itf({
            id: 'number',
            productId: 'number',
            productCode: 'string',
        })]
    })
});

const dealerDefault = {
    id: 'number',
    code: 'string',
    name: 'string'
};
export const DealerSimpleData = itf({
    payload: [
        itf(dealerDefault)
    ]
});

export const DealerData = itf({
    payload: itf({
        content: [itf(dealerDefault)],
        totalElements: 'number'
    })
});
