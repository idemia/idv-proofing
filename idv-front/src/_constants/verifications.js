import methods from '@constants/methods';
import { DOC_TYPE, DOC_SIDES, LIVENESS_TYPES } from '@constants';

export default [
  {
    id: 1,
    flag: 'πΊπΈ',
    methods: [
      methods.unitedStatesDriversLicense,
      methods.passiveLiveness,
      methods.SORCheck,
    ],
    countryCode: 'USA',
    docType: DOC_TYPE.DRIVING_LICENSE,
    livenessType: LIVENESS_TYPES.PASSIVE,
    sorCheck: true,
    docSides: [
      { id: DOC_SIDES.SIDE1, name: DOC_SIDES.FRONT },
      { id: DOC_SIDES.SIDE2, name: DOC_SIDES.BACK },
    ],
  },
  {
    id: 2,
    flag: 'πΊπΈ',
    methods: [
      methods.unitedStatesPassport,
      methods.passiveLiveness,
      methods.SORCheck,
    ],
    countryCode: 'USA',
    docType: DOC_TYPE.PASSPORT,
    livenessType: LIVENESS_TYPES.PASSIVE,
    sorCheck: true,
    docSides: [{ id: DOC_SIDES.SIDE1, name: DOC_SIDES.INSIDE_PAGE }],
  },
  {
    id: 3,
    flag: 'π«π·',
    methods: [
      methods.francePassport,
      methods.passiveLiveness,
      methods.SORCheck,
    ],
    countryCode: 'FRA',
    docType: DOC_TYPE.PASSPORT,
    livenessType: LIVENESS_TYPES.PASSIVE,
    sorCheck: true,
    docSides: [{ id: DOC_SIDES.SIDE1, name: DOC_SIDES.INSIDE_PAGE }],
  },
  {
    id: 4,
    flag: 'π¬π§',
    methods: [
      methods.unitedKingdomDriversLicense,
      methods.passiveLiveness,
      methods.SORCheck,
    ],
    countryCode: 'GBR',
    docType: DOC_TYPE.DRIVING_LICENSE,
    livenessType: LIVENESS_TYPES.PASSIVE,
    sorCheck: true,
    docSides: [
      { id: DOC_SIDES.SIDE1, name: DOC_SIDES.FRONT },
      { id: DOC_SIDES.SIDE2, name: DOC_SIDES.BACK },
    ],
  },
  {
    id: 5,
    flag: 'πΊπΈ',
    methods: [
      methods.unitedStatesPassport,
      methods.highLiveness,
      methods.SORCheck,
    ],
    countryCode: 'USA',
    docType: DOC_TYPE.PASSPORT,
    livenessType: LIVENESS_TYPES.HIGH,
    sorCheck: true,
    docSides: [{ id: DOC_SIDES.SIDE1, name: DOC_SIDES.INSIDE_PAGE }],
  },
  {
    id: 6,
    flag: 'π¬π§',
    methods: [
      methods.unitedKingdomPassport,
      methods.passiveLiveness,
      methods.SORCheck,
    ],
    countryCode: 'GBR',
    docType: DOC_TYPE.PASSPORT,
    livenessType: LIVENESS_TYPES.PASSIVE,
    sorCheck: true,
    docSides: [{ id: DOC_SIDES.SIDE1, name: DOC_SIDES.INSIDE_PAGE }],
  },
  {
    id: 7,
    flag: 'π΅π±',
    methods: [methods.polandIdCard, methods.passiveLiveness],
    countryCode: 'POL',
    docType: DOC_TYPE.IDENTITY_CARD,
    livenessType: LIVENESS_TYPES.PASSIVE,
    docSides: [
      { id: DOC_SIDES.SIDE1, name: DOC_SIDES.FRONT },
      { id: DOC_SIDES.SIDE2, name: DOC_SIDES.BACK },
    ],
  },
  {
    id: 8,
    flag: 'π΅π±',
    methods: [methods.polandIdCard, methods.highLiveness],
    countryCode: 'POL',
    docType: DOC_TYPE.IDENTITY_CARD,
    livenessType: LIVENESS_TYPES.HIGH,
    docSides: [
      { id: DOC_SIDES.SIDE1, name: DOC_SIDES.FRONT },
      { id: DOC_SIDES.SIDE2, name: DOC_SIDES.BACK },
    ],
  },
];
