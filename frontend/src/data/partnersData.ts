export interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

export const partnersData: Partner[] = [
  {
    id: 1,
    name: "Bank BNI",
    logo: "https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png",
    website: "https://www.bni.co.id",
  },
  {
    id: 2,
    name: "Bank Mandiri",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/1200px-Bank_Mandiri_logo_2016.svg.png",
    website: "https://www.bankmandiri.co.id",
  },
  {
    id: 3,
    name: "Bank BCA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png",
    website: "https://www.bca.co.id",
  },
  {
    id: 4,
    name: "Midtrans",
    logo: "https://midtrans.com/assets/images/midtrans-logo.svg",
    website: "https://midtrans.com",
  },
  {
    id: 5,
    name: "Bank BRI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/1200px-BRI_2020.svg.png",
    website: "https://www.bri.co.id",
  },
  {
    id: 6,
    name: "Bank BTN",
    logo: "https://upload.wikimedia.org/wikipedia/id/thumb/4/45/Bank_BTN_logo.svg/1200px-Bank_BTN_logo.svg.png",
    website: "https://www.btn.co.id",
  },
  {
    id: 7,
    name: "GoPay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png",
    website: "https://www.gojek.com/gopay",
  },
  {
    id: 8,
    name: "OVO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/1200px-Logo_ovo_purple.svg.png",
    website: "https://www.ovo.id",
  },
  {
    id: 9,
    name: "Dana",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1200px-Logo_dana_blue.svg.png",
    website: "https://www.dana.id",
  },
  {
    id: 10,
    name: "ShopeePay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Shopee.svg/1200px-Shopee.svg.png",
    website: "https://www.shopeepay.co.id",
  },
];
