export type CameraTag = 'korea' | 'ndaa' | 'usb3' | 'strobe' | 'legacy';
export type LensTag = 'f28' | 'f36_40' | 'ir';
export type StrobeSupportLevel = 'official' | 'conditional' | 'none';

export interface ExternalLink {
  label: string;
  url: string;
}

export interface CameraRecord {
  id: string;
  category: string;
  model: string;
  sensor: string;
  sensorWidthMm: number;
  usb: string;
  fps: string;
  maxUncompressedFps: number;
  isUsb3: boolean;
  lensState: string;
  price: string;
  usdMin: number | null;
  usdMax: number | null;
  krwMin: number | null;
  krwMax: number | null;
  availabilityLabel: string;
  leadTimeNote: string;
  ndaaCompliant: boolean | null;
  hardwareTrigger: boolean;
  strobeSupport: StrobeSupportLevel;
  strobeSpec: string;
  strobePinout: string;
  isCaseOptionAvailable: boolean;
  tags: CameraTag[];
  urls: ExternalLink[];
}

export interface LensRecord {
  id: string;
  category: string;
  model: string;
  focalAperture: string;
  focalLengthMm: number;
  fNumber: number | null;
  sensorFormat: string;
  irCut: string;
  irCutStatus: 'included' | 'selectable' | 'none' | 'ir_corrected' | 'unknown';
  price: string;
  usdMin: number | null;
  usdMax: number | null;
  krwFixed: number | null;
  availabilityLabel: string;
  bulkyWarning: boolean;
  tags: LensTag[];
  urls: ExternalLink[];
}

export interface ConfigCameraSpec {
  id: string;
  name: string;
  sensor: string;
  w: number;
  h: number;
  usb: string;
  isCase: boolean;
  ndaa: boolean;
  korea: boolean;
  trigger: boolean;
  strobeSupport: StrobeSupportLevel;
  strobeDetail: string;
  usb2: boolean;
  priceEstimate: string;
}

export interface ConfigLensSpec {
  id: string;
  name: string;
  f: number;
  aperture: string;
  hasIrCut: 'yes' | 'no' | 'ir_corr' | 'unknown';
  bulky: boolean;
  unknownF: boolean;
  priceEstimate: string;
}

export interface SensorFovRow {
  sensor: string;
  cameras: string;
  dimensions: string;
  hfov: string;
  vfov: string;
  dfov: string;
  width10m: string;
  width15m: string;
}

export interface ChecklistItem {
  id: string;
  indexLabel: string;
  title: string;
  description: string;
  highlights: string[];
}

export const CAMERA_DATA: CameraRecord[] = [
  {
    id: 'basler_160',
    category: '산업용 S-Mount 바디 · 스트로브 공식 지원',
    model: 'Basler dart daA1920-160uc (컬러) / daA1920-160um (흑백)',
    sensor: 'Sony IMX392 (1/2.3") · 2.3MP (1920×1200)',
    sensorWidthMm: 6.62,
    usb: 'Global / USB 3.0 (USB3 Vision)',
    fps: '160 fps',
    maxUncompressedFps: 160,
    isUsb3: true,
    lensState: '렌즈 미포함 (S-Mount 홀더)',
    price: '$289.00 ~ $330.00',
    usdMin: 289,
    usdMax: 330,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식·산업 유통사 (재고/발주)',
    leadTimeNote: 'Basler 공식·Graftek·Electromaker 주문 (I/O 케이블 별도)',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (ExposureActive 출력)',
    strobePinout: '듀얼로우 GPIO 라인(최대 4라인) · pylon LineSource=ExposureActive 설정',
    isCaseOptionAvailable: false,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'Basler 공식(컬러)', url: 'https://www.baslerweb.com/en/shop/daa1920-160uc-s-mount/' },
      { label: 'Basler 공식(흑백)', url: 'https://www.baslerweb.com/en/shop/daa1920-160um-s-mount/' },
      { label: 'Graftek', url: 'https://graftek.com/product/daa1920-160uc-s/' },
      {
        label: 'Electromaker',
        url: 'https://www.electromaker.io/shop/product/the-basler-daa1920-160uc-s-mount-usb-30-camera-with-the-sony-imx392-cmos-sensor-delivers-160-frames-per-second-at-23-mp-resolution-this-model-comes-with-a-s-mount',
      },
    ],
  },
  {
    id: 'ids_u3',
    category: '산업용 S-Mount 바디 · 스트로브 공식 지원',
    model: 'IDS Imaging uEye+ U3-3561XLS Rev 1.2',
    sensor: 'onsemi AR0234 (1/3" 표기) · 2.3MP (1920×1200)',
    sensorWidthMm: 5.76,
    usb: 'Global / USB 3.0 (U3V·GenICam)',
    fps: '102 fps',
    maxUncompressedFps: 102,
    isUsb3: true,
    lensState: 'S-Mount (컬러·흑백·NIR 선택)',
    price: '$296.92 ~ $308.88',
    usdMin: 296.92,
    usdMax: 308.88,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식·머신비전 대리점',
    leadTimeNote: 'IDS 공식 스토어·1stVision·Inosaki 주문',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (전용 Flash Output)',
    strobePinout: '8핀 Würth I/O 커넥터 Pin 3 (Flash Out / Line 1, 비절연) · Pin 4 Trigger In',
    isCaseOptionAvailable: false,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'IDS 공식 스토어', url: 'https://en.ids-imaging.com/store/u3-3561xls-rev-1-2.html' },
      { label: '1stVision', url: 'https://www.1stvision.com/cameras/models/IDS-Imaging/U3-3561XLS-M/C' },
      { label: 'Inosaki', url: 'https://inosaki.com/product/u3-3561xls-rev-1-2-ids-camera/' },
    ],
  },
  {
    id: 'econ_24cug',
    category: 'UVC 산업용 · 보드형 스트로브 공식 지원',
    model: 'e-con Systems See3CAM_24CUG (CH_TC / CHL_TC 보드형)',
    sensor: 'onsemi AR0234CS (1/2.6") · 2.3MP (1920×1200)',
    sensorWidthMm: 5.76,
    usb: 'Global / USB 3.2 Gen 1 (Type-C)',
    fps: 'UYVY 55fps / MJPEG 114fps',
    maxUncompressedFps: 55,
    isUsb3: true,
    lensState: '렌즈 미포함(CH_TC 5팩) 또는 기본 광각 탈거',
    price: '$184 (5팩) / $199 (보드모듈)',
    usdMin: 184,
    usdMax: 199,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식 스토어 직판',
    leadTimeNote: '스트로브 사용 시 반드시 보드형(CH_TC/CHL_TC) 선택 (케이스형 _BX는 핀 미노출)',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (보드형 전용 6핀 STROBE)',
    strobePinout: '6핀 GPIO 헤더 Pin 5 (STROBE 출력) · Pin 4 TRIG(최대 6.5V) · VCC_5V1(400mA)',
    isCaseOptionAvailable: true,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'e-con 공식(영문)', url: 'https://www.e-consystems.com/industrial-cameras/ar0234-usb3-global-shutter-camera.asp' },
      { label: 'e-con 공식(한국어)', url: 'https://www.e-consystems.com/kr/industrial-cameras/ar0234-usb3-global-shutter-camera-kr.asp' },
    ],
  },
  {
    id: 'econ_20cug',
    category: 'UVC 흑백·RGB-IR · 보드형 스트로브 지원',
    model: 'e-con Systems See3CAM_20CUG (MHL_TC 보드형) / 27CUG',
    sensor: 'OV2311 (2MP) / OV2312 (1/2.9", 1600×1300)',
    sensorWidthMm: 4.8,
    usb: 'Global / USB 3.1·3.2 Gen 1',
    fps: '90 fps (20CUG) / 36 fps (27CUG)',
    maxUncompressedFps: 90,
    isUsb3: true,
    lensState: 'M12 (S-Mount) 교체 가능',
    price: '~130유로 (20CUG) / $229 (27CUG)',
    usdMin: 140,
    usdMax: 229,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식 스토어 직판',
    leadTimeNote: '반드시 케이스 없는 보드형(MHL_TC) 선택 시 스트로브·트리거 헤더 제공',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (보드형 MHL_TC 전용)',
    strobePinout: '온보드 GPIO 헤더 STROBE 출력(노출 동기화 펄스) · 케이스형(_BX) 미지원',
    isCaseOptionAvailable: false,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'See3CAM_20CUG', url: 'https://www.e-consystems.com/industrial-cameras/ov2311-monochrome-global-shutter-camera.asp' },
      { label: 'See3CAM_27CUG', url: 'https://www.e-consystems.com/usb-cameras/2mp-ov2312-global-shutter-rgb-ir-camera.asp' },
    ],
  },
  {
    id: 'alvium_u240',
    category: '산업용 S-Mount · 초고속 스트로브 공식 지원',
    model: 'Allied Vision Alvium 1800 U-240 (S-Mount 옵션)',
    sensor: 'Sony IMX392 (1/2.3") · 2.4MP (1936×1216)',
    sensorWidthMm: 6.7,
    usb: 'Global / USB 3.1 Gen 1 (USB3 Vision)',
    fps: '176 fps',
    maxUncompressedFps: 176,
    isUsb3: true,
    lensState: 'S-Mount (M12×0.5) 옵션 주문 (필터리스 가능)',
    price: '$300 ~ $600+ (구성별 견적)',
    usdMin: 300,
    usdMax: 600,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식·산업 유통사 견적 발주',
    leadTimeNote: 'Allied Vision·1stVision·Edmund Optics에서 S-Mount 옵션 견적 주문',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (4채널 프로그래머블 GPIO)',
    strobePinout: '산업용 I/O 포트 4×비절연 GPIO · Vimba/GenICam ExposureActive 스트로브 출력',
    isCaseOptionAvailable: true,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'Allied Vision 공식', url: 'https://www.alliedvision.com/en/camera-selector/detail/alvium/1800-u-240/' },
      { label: '1stVision', url: 'https://www.1stvision.com/cameras/models/Allied-Vision/Alvium-1800-U-240m-S-Mount' },
    ],
  },
  {
    id: 'tis_dfm37ux265',
    category: '산업용 M12 보드카메라 · 스트로브 공식 지원',
    model: 'The Imaging Source DFM 37UX265-ML (3.1MP) / 37UR0234-ML',
    sensor: 'Sony IMX265 (1/1.8", 3.1MP 2048×1536) / AR0234 (2.3MP)',
    sensorWidthMm: 7.07,
    usb: 'Global / USB 3.1 Gen 1 (U3V·Type-C)',
    fps: '60 fps (37UX265) / 100 fps (37UR0234)',
    maxUncompressedFps: 60,
    isUsb3: true,
    lensState: 'M12×0.5 보드 마운트 기본 탑재 (-ML)',
    price: '약 $656.00 (37UX265-ML)',
    usdMin: 656,
    usdMax: 656,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식·머신비전 대리점',
    leadTimeNote: '37UX265-ML 현행 판매중 (참고: AR0234 탑재 37UR0234-ML은 EoL 예정)',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (전용 STROBE_OUT)',
    strobePinout: '4핀 물리 I/O 커넥터 STROBE_OUT(노출 동기 출력) + 옵토절연 TRIGGER_IN',
    isCaseOptionAvailable: false,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'TIS DFM 37UX265-ML', url: 'https://www.theimagingsource.com/en-us/product/board/37u/dfm37ux265ml/' },
      { label: 'OEMCameras 구매', url: 'https://www.oemcameras.com/the-imaging-source-dfm-37ux265-ml.htm' },
    ],
  },
  {
    id: 'flir_bfs23s3',
    category: '산업용 보드레벨 · 옵토절연 스트로브 공식 지원',
    model: 'Teledyne FLIR Blackfly S BFS-U3-23S3C/M-BD + ACC-01-5006',
    sensor: 'Sony IMX392 (1/2.3") · 2.3MP (1920×1200)',
    sensorWidthMm: 6.62,
    usb: 'Global / USB 3.1 Gen 1 (USB3 Vision)',
    fps: '163 fps',
    maxUncompressedFps: 163,
    isUsb3: true,
    lensState: '보드형 + 별도 S-Mount(M12) 홀더 ACC-01-5006 결합',
    price: '$380~$550 (바디) + $43.90 (M12 홀더)',
    usdMin: 423.9,
    usdMax: 593.9,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 공식·Edmund Optics 발주',
    leadTimeNote: '보드레벨(-BD) 본체와 금속 S-Mount 홀더(ACC-01-5006) 함께 주문 필수',
    ndaaCompliant: true,
    hardwareTrigger: true,
    strobeSupport: 'official',
    strobeSpec: '공식 지원 (옵토절연 Strobe/Timer)',
    strobePinout: '로우프로파일 GPIO 커넥터 · 옵토절연 I/O + 내장 타이머/카운터/로직 블록',
    isCaseOptionAvailable: false,
    tags: ['ndaa', 'usb3', 'strobe'],
    urls: [
      { label: 'Teledyne FLIR BD', url: 'https://www.teledynevisionsolutions.com/products/blackfly-s-board-level/' },
      { label: 'S-Mount 홀더(ACC-01-5006)', url: 'https://www.teledynevisionsolutions.com/products/acc-01-5006/' },
      { label: 'Edmund Optics', url: 'https://www.edmundoptics.com/p/flir-blackfly-s-bfs-u3-23s3c-c-usb3-color-camera/40161/' },
    ],
  },
  {
    id: 'elp_p02',
    category: '저가형 P02 개정판 · 스트로브/트리거 핀 내장',
    model: 'ELP-USBGS1200P02 (12mm 렌즈 옵션 + Flash Sync)',
    sensor: 'onsemi AR0234 (1/2.6") · 2.3MP (1920×1200)',
    sensorWidthMm: 5.76,
    usb: 'Global / USB 2.0 (비압축 고속 제한)',
    fps: 'MJPEG 90~120 fps',
    maxUncompressedFps: 8,
    isUsb3: false,
    lensState: '12mm 옵션 선택 가능 (단, F값 미기재)',
    price: '약 $65.00 ~ $140.00',
    usdMin: 65,
    usdMax: 140,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 직구 (P02 개정판 지정 주문)',
    leadTimeNote: '구형 P01이 아닌 반드시 외부 트리거·플래시 지원 P02 모델로 지정 주문',
    ndaaCompliant: null,
    hardwareTrigger: true,
    strobeSupport: 'conditional',
    strobeSpec: '조건부 지원 (μs Flash Sync 출력)',
    strobePinout: '전용 외부 트리거 입력 + 동기화 Flash/Strobe 출력 핀 (MOSFET/포토커플러 연동 권장)',
    isCaseOptionAvailable: true,
    tags: ['strobe', 'legacy'],
    urls: [
      { label: 'ELP 공식 카탈로그', url: 'https://www.elpcctv.com/elp-2mp-ar0234-sensor-1200p-1080p-90fps-global-shutter-usb-camera-p-388.html' },
      { label: 'WebcameraUSB 스토어', url: 'https://www.webcamerausb.com/' },
    ],
  },
  {
    id: 'arducam_b0495',
    category: '국내 즉시 조달 · 기본 UVC 스트로브 미활성',
    model: 'Arducam B0495C (케이스형) / B0495 (보드형)',
    sensor: 'onsemi AR0234 (1/2.6") · 2.3MP (1920×1200)',
    sensorWidthMm: 5.76,
    usb: 'Global / USB 3.2 Gen 1 (Type-C)',
    fps: 'YUY2 50fps @1200p / 80fps @600p',
    maxUncompressedFps: 50,
    isUsb3: true,
    lensState: '기본 3.6mm F3.0 장착 (M12 교체형)',
    price: '$183.99 (국내 251,400~276,540원)',
    usdMin: 183.99,
    usdMax: 183.99,
    krwMin: 251400,
    krwMax: 276540,
    availabilityLabel: '국내 즉시 조달 (재고 보유)',
    leadTimeNote: '내부 UC-B65 보드에 FLASH 패드가 있으나 기본 UVC 펌웨어는 프리런 전용(커스텀 FW 필요)',
    ndaaCompliant: false,
    hardwareTrigger: false,
    strobeSupport: 'conditional',
    strobeSpec: '기본 FW 미동작 (커스텀 FW 필요)',
    strobePinout: '내부 6핀 패드(FLASH/TRIGGER, 1.8V/3.3V CMOS) · Arducam 전용 펌웨어 문의 필수',
    isCaseOptionAvailable: true,
    tags: ['korea', 'usb3'],
    urls: [
      { label: '디바이스마트(B0495C)', url: 'https://www.devicemart.co.kr/goods/view?no=15946262' },
      { label: '디바이스마트(B0495)', url: 'https://www.devicemart.co.kr/goods/view?no=15946263' },
      {
        label: '가치창조기술',
        url: 'https://m.vctec.co.kr/product/%EC%95%84%EB%91%90%EC%BA%A0-23mp-ar0234-%EC%BB%AC%EB%9F%AC-%EA%B8%80%EB%A1%9C%EB%B2%8C-%EC%85%94%ED%84%B0-usb-30-%EC%B9%B4%EB%A9%94%EB%9D%BC-%EB%AA%A8%EB%93%88-arducam-23mp-ar0234-color-glob/26549/display/1/',
      },
      {
        label: 'RobotShop',
        url: 'https://www.robotshop.com/products/arducam-23mp-ar0234-color-global-shutter-usb-30-camera-module-w-encolsure',
      },
      {
        label: 'Welectron',
        url: 'https://www.welectron.com/Arducam-B0495-1-23MP-AR0234-Color-Global-Shutter-USB-30-Camera-Module-Without-Encolsure_1',
      },
    ],
  },
  {
    id: 'elp_l12',
    category: '구형 일체형 (스트로브 미지원 · 제외 권고)',
    model: 'ELP-USBGS1200P01-L12 / -KFVIR',
    sensor: 'onsemi AR0234 (1/2.6") · 2.3MP (1920×1200)',
    sensorWidthMm: 5.76,
    usb: 'Global / USB 2.0 (비압축 고속 제한)',
    fps: 'MJPEG 90 fps',
    maxUncompressedFps: 8,
    isUsb3: false,
    lensState: '12mm 옵션(-L12) 또는 2.8-12mm, F값 미기재',
    price: '약 $75.90 ~ $76.50',
    usdMin: 75.9,
    usdMax: 76.5,
    krwMin: null,
    krwMax: null,
    availabilityLabel: '해외 직구 (구형 P01 기본판)',
    leadTimeNote: '표준 UVC 보드로 외부 스트로브 핀 미노출 (스트로브 필요 시 P02 개정판 선택)',
    ndaaCompliant: null,
    hardwareTrigger: false,
    strobeSupport: 'none',
    strobeSpec: '미지원 (표준 UVC 보드)',
    strobePinout: '외부 GPIO/스트로브 헤더 미제공 (조명 동기화 제어 불가)',
    isCaseOptionAvailable: true,
    tags: ['legacy'],
    urls: [
      { label: 'ELP L12 옵션 모델', url: 'https://www.elpcctv.com/elp-2mp-ar0234-sensor-1200p-1080p-90fps-global-shutter-usb-camera-p-388.html' },
      {
        label: 'ELP 2.8-12mm IR',
        url: 'https://www.elpcctv.com/elp-2mp-global-shutter-1200p-1080p-90fps-ir-led-for-daynight-vision-m12-2812mm-lens-usb-camera-p-566.html',
      },
    ],
  },
];

export const LENS_DATA: LensRecord[] = [
  {
    id: 'arducam_m1812',
    category: '국내 즉시 조달 · F2.8',
    model: 'Arducam M1812ZH03S (LN077)',
    focalAperture: '12mm / F/2.8',
    focalLengthMm: 12,
    fNumber: 2.8,
    sensorFormat: '1/1.8" (8MP+ / 4K 저왜곡)',
    irCut: '정보 미기재 (구매 시 확인 필요)',
    irCutStatus: 'unknown',
    price: '48,000원 (VAT포함 52,800원)',
    usdMin: null,
    usdMax: null,
    krwFixed: 52800,
    availabilityLabel: '국내 즉시 조달 (재고 보유)',
    bulkyWarning: false,
    tags: ['f28'],
    urls: [
      { label: '디바이스마트', url: 'https://www.devicemart.co.kr/goods/view?no=15946151' },
      {
        label: '가치창조기술',
        url: 'https://m.vctec.co.kr/product/%EC%95%84%EB%91%90%EC%BA%A0-118-4k-12mm-%EC%A0%80%EC%99%9C%EA%B3%A1-m12-%EB%A0%8C%EC%A6%88-os08a10os08a20%EC%9A%A9arducam-118-4k-12mm-low-dist/24461/',
      },
      {
        label: 'Welectron',
        url: 'https://www.welectron.com/Arducam-LN077-1-18-4K-12mm-Low-Distortion-M12-Lens-for-OS08A10OS08A20-and-more-image-sensors-with-large-optical-format',
      },
    ],
  },
  {
    id: 'edmund_33878',
    category: '산업용 고정 조리개 · F4.0',
    model: 'Edmund Optics #33-878 (UCi Series)',
    focalAperture: '12.00mm / f/4',
    focalLengthMm: 12,
    fNumber: 4.0,
    sensorFormat: '최대 1/1.8" (9.00mm 서클, 12MP)',
    irCut: '미포함 (IR Cut Filter: No, VIS 코팅)',
    irCutStatus: 'none',
    price: '$270.00',
    usdMin: 270,
    usdMax: 270,
    krwFixed: null,
    availabilityLabel: '해외 공식 즉시 주문',
    bulkyWarning: true,
    tags: ['f36_40'],
    urls: [
      { label: 'Edmund Optics 공식', url: 'https://www.edmundoptics.com/p/12mm-f-4-uci-series-fixed-focal-length-lens/38762/' },
    ],
  },
  {
    id: 'edmund_uav',
    category: '산업용 고정 조리개 · F2.8 라인업',
    model: 'Edmund Optics UAV / HP / 1/1" 저왜곡 시리즈',
    focalAperture: '12mm / f/2.8',
    focalLengthMm: 12,
    fNumber: 2.8,
    sensorFormat: 'S-Mount(M12) 12mm f/2.8 라인업',
    irCut: '상세 스펙 페이지 확인',
    irCutStatus: 'unknown',
    price: '온라인 견적·확인',
    usdMin: null,
    usdMax: null,
    krwFixed: null,
    availabilityLabel: '해외 공식 견적·발주',
    bulkyWarning: false,
    tags: ['f28'],
    urls: [
      { label: 'UAV 시리즈(#56710)', url: 'https://www.edmundoptics.com/p/12mm-focal-length-uav-series-fixed-focal-length-lens/56710/' },
      { label: '1/1" 12MP(#42164)', url: 'https://www.edmundoptics.com/p/11-12mm-f28-120-megapixel-ultra-low-distortion-lens/42164/' },
      { label: 'HP 시리즈(#28989)', url: 'https://www.edmundoptics.com/p/12mm-focal-length-hp-series-fixed-focal-length-lens/28989/' },
    ],
  },
  {
    id: 'commonlands_cil125',
    category: '산업용 F3.6 · 필터 선택형',
    model: 'Commonlands CIL125',
    focalAperture: '12.5mm / F/3.6 (또는 F/2.4)',
    focalLengthMm: 12.5,
    fNumber: 3.6,
    sensorFormat: '최대 1/2.3"~1/1.8" (12MP+)',
    irCut: '선택 가능 (M12A650 650nm IRC / M12ANIR 무필터)',
    irCutStatus: 'selectable',
    price: '$39.00',
    usdMin: 39,
    usdMax: 39,
    krwFixed: null,
    availabilityLabel: '해외 공식 온라인 주문',
    bulkyWarning: false,
    tags: ['f36_40', 'ir'],
    urls: [
      { label: 'Commonlands 공식', url: 'https://commonlands.com/products/telephoto-12mm-m12-lens' },
    ],
  },
  {
    id: 'azure_ir',
    category: 'IR 보정 · F2.8 산업용',
    model: 'Azure Photonics AZURE-IR1228B5M',
    focalAperture: '12mm / F/2.8',
    focalLengthMm: 12,
    fNumber: 2.8,
    sensorFormat: '1/1.8" (5MP, IR-Corrected)',
    irCut: 'IR 보정 (가시광·근적외선 초점 일치)',
    irCutStatus: 'ir_corrected',
    price: '견적 문의',
    usdMin: null,
    usdMax: null,
    krwFixed: null,
    availabilityLabel: '유통사 견적 발주 (RMA)',
    bulkyWarning: false,
    tags: ['f28', 'ir'],
    urls: [
      { label: 'RMA Electronics', url: 'https://www.rmaelectronics.com/azure-photonics-azure-ir1228b5m/' },
    ],
  },
  {
    id: 'camemaker',
    category: '머신비전 F2.8',
    model: 'Camemaker CM_LENS_10105',
    focalAperture: '12mm / F/2.8',
    focalLengthMm: 12,
    fNumber: 2.8,
    sensorFormat: '1/1.8" (5MP, 이미지 서클 9mm)',
    irCut: '문의 필요',
    irCutStatus: 'unknown',
    price: '견적 문의',
    usdMin: null,
    usdMax: null,
    krwFixed: null,
    availabilityLabel: '공식 견적 문의',
    bulkyWarning: false,
    tags: ['f28'],
    urls: [
      {
        label: 'Camemaker 공식',
        url: 'https://www.camemaker.com/shop/cm-lens-10105-lens-12mm-f-2-8-1-1-8-m12-board-lens-camemake-2536',
      },
    ],
  },
  {
    id: 'vaimaging',
    category: '무왜곡 F2.8',
    model: 'VA-Imaging VA-LM12-5MP-12MM',
    focalAperture: '12mm / F/2.8',
    focalLengthMm: 12,
    fNumber: 2.8,
    sensorFormat: '1/1.8" (5MP Non-Distortion)',
    irCut: '상세 확인 필요',
    irCutStatus: 'unknown',
    price: '견적 문의',
    usdMin: null,
    usdMax: null,
    krwFixed: null,
    availabilityLabel: '공식 견적 문의',
    bulkyWarning: false,
    tags: ['f28'],
    urls: [
      { label: 'VA-Imaging 컬렉션', url: 'https://va-imaging.com/collections/lens-m12-camera' },
    ],
  },
];

export const CONFIG_CAMERAS: Record<string, ConfigCameraSpec> = {
  econ_24cug_board: {
    id: 'econ_24cug_board',
    name: 'e-con See3CAM_24CUG (보드형 CH_TC)',
    sensor: 'onsemi AR0234CS (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 3.2 Gen 1 (UYVY 55fps / MJPEG 114fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '6핀 GPIO 헤더 Pin 5 (STROBE 출력) + Pin 4 TRIG(최대 6.5V) + VCC_5V1(400mA)',
    usb2: false,
    priceEstimate: '$184 (5팩) / $199 (모듈)',
  },
  ids_u3: {
    id: 'ids_u3',
    name: 'IDS uEye+ U3-3561XLS',
    sensor: 'onsemi AR0234 (1/2.6"급)',
    w: 5.76,
    h: 3.6,
    usb: 'USB 3.0 U3V (최대 102fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '8핀 Würth I/O 커넥터 Pin 3 (Flash Out / Line 1) + Pin 4 Trigger In',
    usb2: false,
    priceEstimate: '$296.92 ~ $308.88',
  },
  basler_160: {
    id: 'basler_160',
    name: 'Basler daA1920-160uc S-Mount',
    sensor: 'Sony IMX392 (1/2.3")',
    w: 6.62,
    h: 4.14,
    usb: 'USB 3.0 U3V (최대 160fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: 'GPIO 라인 LineSource=ExposureActive 설정으로 노출 동기화 스트로브 출력',
    usb2: false,
    priceEstimate: '$289.00 ~ $330.00',
  },
  alvium_u240: {
    id: 'alvium_u240',
    name: 'Allied Vision Alvium 1800 U-240 (S-Mount)',
    sensor: 'Sony IMX392 (1/2.3")',
    w: 6.7,
    h: 4.2,
    usb: 'USB 3.1 Gen 1 U3V (최대 176fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '산업용 I/O 포트 4채널 프로그래머블 GPIO (ExposureActive 스트로브 출력)',
    usb2: false,
    priceEstimate: '$300 ~ $600+ (견적)',
  },
  tis_dfm37ux265: {
    id: 'tis_dfm37ux265',
    name: 'The Imaging Source DFM 37UX265-ML',
    sensor: 'Sony IMX265 (1/1.8", 3.1MP)',
    w: 7.07,
    h: 5.3,
    usb: 'USB 3.1 Gen 1 U3V (최대 60fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '4핀 물리 I/O 커넥터 STROBE_OUT + 옵토절연 TRIGGER_IN',
    usb2: false,
    priceEstimate: '약 $656.00',
  },
  flir_bfs23s3: {
    id: 'flir_bfs23s3',
    name: 'Teledyne FLIR BFS-U3-23S3-BD + ACC-01-5006',
    sensor: 'Sony IMX392 (1/2.3")',
    w: 6.62,
    h: 4.14,
    usb: 'USB 3.1 Gen 1 U3V (최대 163fps)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '옵토절연 GPIO 스트로브 출력 + 타이머/카운터/로직 블록 지원',
    usb2: false,
    priceEstimate: '$423.90 ~ $593.90',
  },
  econ_20cug: {
    id: 'econ_20cug',
    name: 'e-con See3CAM_20CUG (흑백 보드형)',
    sensor: 'OmniVision OV2311 (1/2.9")',
    w: 4.8,
    h: 3.9,
    usb: 'USB 3.1 Gen 1 (90fps 흑백)',
    isCase: false,
    ndaa: true,
    korea: false,
    trigger: true,
    strobeSupport: 'official',
    strobeDetail: '보드형(MHL_TC) 전용 GPIO/Strobe 헤더 출력 지원 (_BX 케이스형 제외)',
    usb2: false,
    priceEstimate: '약 130유로',
  },
  econ_24cug_case: {
    id: 'econ_24cug_case',
    name: 'e-con See3CAM_24CUG (케이스형 _BX)',
    sensor: 'onsemi AR0234CS (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 3.2 Gen 1 (UYVY 55fps / MJPEG 114fps)',
    isCase: true,
    ndaa: true,
    korea: false,
    trigger: false,
    strobeSupport: 'none',
    strobeDetail: '케이스형(_BX)은 외부 6핀 GPIO/Strobe 헤더가 노출되지 않습니다 (보드형 CH_TC 필수).',
    usb2: false,
    priceEstimate: '$249.00',
  },
  elp_p02: {
    id: 'elp_p02',
    name: 'ELP-USBGS1200P02-L12 (Flash 개정판)',
    sensor: 'onsemi AR0234 (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 2.0 (MJPEG 90~120fps / 비압축 ~8fps)',
    isCase: false,
    ndaa: false,
    korea: false,
    trigger: true,
    strobeSupport: 'conditional',
    strobeDetail: '외부 트리거 + μs 동기화 Flash/Strobe 출력 핀 제공 (단, USB 2.0·렌즈 F값 미기재)',
    usb2: true,
    priceEstimate: '$65.00 ~ $140.00',
  },
  arducam_b0495: {
    id: 'arducam_b0495',
    name: 'Arducam B0495 (보드형)',
    sensor: 'onsemi AR0234 (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 3.2 Gen 1 (YUY2 50fps @1200p)',
    isCase: false,
    ndaa: false,
    korea: true,
    trigger: false,
    strobeSupport: 'conditional',
    strobeDetail: '내부 보드(UC-B65)에 FLASH 패드가 있으나 기본 UVC 펌웨어에서는 미동작 (커스텀 FW 필요)',
    usb2: false,
    priceEstimate: '약 251,400원 ($183.99)',
  },
  arducam_b0495c: {
    id: 'arducam_b0495c',
    name: 'Arducam B0495C (케이스형)',
    sensor: 'onsemi AR0234 (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 3.2 Gen 1 (YUY2 50fps @1200p)',
    isCase: true,
    ndaa: false,
    korea: true,
    trigger: false,
    strobeSupport: 'conditional',
    strobeDetail: '케이스 밀폐 및 기본 UVC 펌웨어 프리런 전용으로 즉시 스트로브 제어 불가',
    usb2: false,
    priceEstimate: '약 276,540원 ($183.99)',
  },
  elp_l12: {
    id: 'elp_l12',
    name: 'ELP-USBGS1200P01-L12 (구형)',
    sensor: 'onsemi AR0234 (1/2.6")',
    w: 5.76,
    h: 3.6,
    usb: 'USB 2.0 (MJPEG 90fps / 비압축 ~8fps)',
    isCase: true,
    ndaa: false,
    korea: false,
    trigger: false,
    strobeSupport: 'none',
    strobeDetail: '구형 P01 표준 UVC 보드로 외부 스트로브 출력 헤더 미지원 (P02 선택 필요)',
    usb2: true,
    priceEstimate: '$75.90 ~ $76.50',
  },
};

export const CONFIG_LENSES: Record<string, ConfigLensSpec> = {
  arducam_m1812: {
    id: 'arducam_m1812',
    name: 'Arducam M1812ZH03S',
    f: 12.0,
    aperture: 'F/2.8',
    hasIrCut: 'unknown',
    bulky: false,
    unknownF: false,
    priceEstimate: '52,800원 (VAT포함)',
  },
  commonlands_cil125_irc: {
    id: 'commonlands_cil125_irc',
    name: 'Commonlands CIL125 (M12A650)',
    f: 12.5,
    aperture: 'F/3.6',
    hasIrCut: 'yes',
    bulky: false,
    unknownF: false,
    priceEstimate: '$39.00',
  },
  commonlands_cil125_nir: {
    id: 'commonlands_cil125_nir',
    name: 'Commonlands CIL125 (M12ANIR)',
    f: 12.5,
    aperture: 'F/3.6',
    hasIrCut: 'no',
    bulky: false,
    unknownF: false,
    priceEstimate: '$39.00',
  },
  edmund_33878: {
    id: 'edmund_33878',
    name: 'Edmund Optics #33-878',
    f: 12.0,
    aperture: 'f/4.0',
    hasIrCut: 'no',
    bulky: true,
    unknownF: false,
    priceEstimate: '$270.00',
  },
  edmund_uav: {
    id: 'edmund_uav',
    name: 'Edmund Optics #56710 UAV',
    f: 12.0,
    aperture: 'f/2.8',
    hasIrCut: 'unknown',
    bulky: false,
    unknownF: false,
    priceEstimate: '온라인 견적',
  },
  azure_ir: {
    id: 'azure_ir',
    name: 'Azure Photonics IR1228B5M',
    f: 12.0,
    aperture: 'F/2.8',
    hasIrCut: 'ir_corr',
    bulky: false,
    unknownF: false,
    priceEstimate: '견적 문의',
  },
  elp_stock: {
    id: 'elp_stock',
    name: 'ELP 기본 12mm 옵션 렌즈',
    f: 12.0,
    aperture: 'F값 미기재',
    hasIrCut: 'unknown',
    bulky: false,
    unknownF: true,
    priceEstimate: '바디 일체형 포함',
  },
};

export const SENSOR_FOV_REFERENCE: SensorFovRow[] = [
  {
    sensor: 'onsemi AR0234CS (1/2.6")',
    cameras: 'See3CAM_24CUG, IDS U3-3561XLS, Arducam B0495',
    dimensions: '5.76 × 3.60 mm',
    hfov: '26.99°',
    vfov: '17.06°',
    dfov: '31.61°',
    width10m: '4.80 m',
    width15m: '7.20 m',
  },
  {
    sensor: 'Sony IMX392 (1/2.3")',
    cameras: 'Basler dart daA1920-160uc/um',
    dimensions: '6.62 × 4.14 mm',
    hfov: '30.86°',
    vfov: '19.57°',
    dfov: '36.06°',
    width10m: '5.52 m',
    width15m: '8.28 m',
  },
  {
    sensor: 'OmniVision OV2311/2312 (1/2.9")',
    cameras: 'See3CAM_20CUG, See3CAM_27CUG',
    dimensions: '4.80 × 3.90 mm',
    hfov: '22.62°',
    vfov: '18.46°',
    dfov: '28.90°',
    width10m: '4.00 m',
    width15m: '6.00 m',
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'check-ircut',
    indexLabel: '점검 01 · 광학 필터',
    title: 'IR-Cut 필터 위치 및 주·야간 용도 일치 확인',
    description:
      'Arducam B0495는 기본 3.6mm 렌즈에 650nm IR-Cut 필터가 통합되어 있어, Edmund Optics #33-878처럼 필터가 없는 렌즈로 교체 시 주간 색감이 왜곡됩니다. 주간 컬러 위주면 650nm IR-Cut 내장 렌즈(CIL125-M12A650 등)를, 야간 IR 조명 병행 시 무필터(M12ANIR) 또는 IR 보정 렌즈를 선택하세요.',
    highlights: ['Arducam B0495', 'Edmund Optics #33-878', '650nm IR-Cut'],
  },
  {
    id: 'check-housing',
    indexLabel: '점검 02 · 기구물 간섭',
    title: '렌즈 홀더 높이(BFL)와 완제품 케이스 간섭 점검',
    description:
      'Arducam M1812ZH03S는 10~12mm 높이 M12 홀더 기준, CIL120은 약 13mm 홀더를 권장합니다. 특히 Edmund #33-878(외경 22mm, 길이 38mm)은 B0495C나 See3CAM_24CUG 케이스 개구부와 간섭할 수 있으므로 케이스 없는 보드형 바디를 우선 고려하세요.',
    highlights: ['Arducam M1812ZH03S', 'BFL 10~13mm', '보드형 바디 우선'],
  },
  {
    id: 'check-ndaa',
    indexLabel: '점검 03 · 조달 규정',
    title: '공급망 보안 및 미국 국방수권법(NDAA 제889조) 준수',
    description:
      '공공·교통·보안 인프라 구축 시 발주처의 공급망 규정을 확인해야 합니다. e-con Systems(인도/미국)와 Basler(독일)는 NDAA 제889조 준수가 명시되어 있으나, 중국계 하이크로봇(Hikrobot)은 규제 대상이며 기타 OEM(ELP 등)은 별도 적합 여부 확인이 필요합니다.',
    highlights: ['NDAA 제889조', 'e-con Systems / Basler', 'Hikrobot 제외'],
  },
  {
    id: 'check-trigger',
    indexLabel: '점검 04 · 동기화 제어',
    title: '외부 하드웨어 트리거 및 조명 스트로브 연동 I/O',
    description:
      '레이더·루프 센서 또는 LED 스트로브 조명과 노출 시점을 정밀 동기화해야 한다면 보드형에 6핀 GPIO(Trigger In / Strobe Out)를 제공하는 See3CAM_24CUG나 USB3 Vision·GenICam 표준 I/O를 지원하는 Basler daA1920-160uc, IDS U3-3561XLS를 선택하는 것이 유리합니다.',
    highlights: ['6핀 GPIO', 'USB3 Vision / GenICam', 'Trigger & Strobe'],
  },
];
