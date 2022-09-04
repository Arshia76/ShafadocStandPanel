import AudioNotification1 from './Audios/notification1.mp3';
import AudioNotification2 from './Audios/notification2.mp3';
import ImageMainLogo from './Image/main-logo.svg';
import ImageBackSpace from './Image/backspace.svg';
import ImageBackSpaceWhite from './Image/backspace-white.svg';
import ImagePackCancel from './Image/pack/cancel.svg';
import ImagePackCancelWhite from './Image/pack/cancel-white.svg';
import ImagePackTrash1White from './Image/pack/trash1-white.svg';
import ImagePackCheck from './Image/pack/check.svg';
import ImagePackCheckWhite from './Image/pack/check-white.svg';
import ImageDay from './Image/day.png';
import ImageNight from './Image/night.png';
import ImagePackWallClock from './Image/pack/wall-clock.svg';
import ImageClockBlack from './Image/pack/wall-clock.svg';
import ImagePackCalendar from './Image/pack/calendar.svg';
import ImagePackHome from './Image/pack/home.svg';
import ImageCircle1 from './Image/simple-circle-1.svg';
import ImageCircle2 from './Image/simple-circle-2.svg';
import ImageCircle3 from './Image/simple-circle-3.svg';
import ImageCircle4 from './Image/simple-circle-4.svg';
import ImageDoctor from './Image/doctor.svg';
import ImageLoaderWhite from './Image/loader.svg';
import ImageLoaderBlack from './Image/loader-black.svg';
import ImageWatchBlack from './Image/pack/timer1.svg';
import ImageWatchWhite from './Image/pack/timer1White.svg';
import ImageClockWhite from './Image/pack/wall-clock2.svg';
import ImageSplash from './Image/splash.svg';
import ImageClickerWhite from './Image/pack/clicker-white.svg'
import ImageClickerDark from './Image/pack/clicker.svg';
import Imagedarmangah from './Image/darmangah.svg'


class Resource {
    static AUDIO = {
        NOTIFICATION1: AudioNotification1,
        NOTIFICATION2: AudioNotification2
    };

    static IMAGE = {
        PACK: {
            CANCEL: {
                BLACK: ImagePackCancel,
                WHITE: ImagePackCancelWhite
            },
            CLICKER: {
                WHITE: ImageClickerWhite,
                BLACK: ImageClickerDark
            },
            CHECK: {
                BLACK: ImagePackCheck,
                WHITE: ImagePackCheckWhite
            },
            TRASH1: {
                WHITE: ImagePackTrash1White
            },
            WALL_CLOCK: ImagePackWallClock,
            CALENDAR: ImagePackCalendar,
            HOME: ImagePackHome
        },
        MAIN_LOGO: ImageMainLogo,
        DAY: ImageDay,
        NIGHT: ImageNight,
        DOCTOR: ImageDoctor,
        CIRCLE: {
            1: ImageCircle1,
            2: ImageCircle2,
            3: ImageCircle3,
            4:ImageCircle4
        },

        DARMANGAH: Imagedarmangah,

        BACK_SPACE: {
            BLACK: ImageBackSpace,
            WHITE: ImageBackSpaceWhite
        },
        LOADER: {
            WHITE: ImageLoaderWhite,
            BLACK: ImageLoaderBlack
        },
        Time: {
            WHITE: ImageWatchWhite,
            BLACK: ImageWatchBlack
        },
        Clock: {
            WHITE: ImageClockWhite,
            BLACK: ImageClockBlack
        },
        Splash: ImageSplash
    };

    static Print = {
        RECEIPT: '/print/receipt'
    };

    static Route = {
        HOME: '/',
        DARMANGAH: '/darmangah',
        PARACLINIC_RECEPTION: '/paraclinic-reception',
        SPECIALITIES: '/specialities',
        DOCTORS: '/doctors',
        RESERVE_FINALIZATION: '/reserve-finalization',
        TELL_FINALIZATION: '/tell-finalization',
        SETTING: '/setting',
        CALENDAR: '/calendar',
        TEST: '/test',
        DOCTOR_TIME: '/doctor-time',
        QUEUE: '/queue/:type'
    };
}

export default Resource;