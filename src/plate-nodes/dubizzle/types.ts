interface PlateDetails {
  'Plate number': {
    ar: {
      value: string;
    };
  };
  'Plate code'?: {
    ar: {
      value: string;
    };
  };
}
interface PlateInfo {
  price: string;
  details: PlateDetails;
  absolute_url: {
    ar: string;
  };
  photos: {
    main: string;
  };
  site: {
    en: string;
  };
}

export interface DubizzleResponseDataType {
  results: [
    {
      hits: PlateInfo[];
    },
  ];
}
