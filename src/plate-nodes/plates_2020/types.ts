interface plateInfo {
  price: string;
  number: string;
  code: {
    code: string;
    city: {
      name: string;
    };
  };
  editor: {
    phone: string;
  };
}
export interface plates_2020 {
  data: {
    items: plateInfo[];
  };
}
