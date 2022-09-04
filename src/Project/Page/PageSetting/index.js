import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import './index.css';
import {connect} from "react-redux";
import {updateSetting} from "../../../Redux/Actions/setting";
import Input from "../../../Components/Input";
import Button from "../../../Components/Button";
import Main from "../../../ElectronLayer/Main";
import Resource from "../../../Resource";
import {Url} from "../../../App";
import {updateBase} from "../../../Redux/Actions/base";

class PageSetting extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            printerList: [],
            queueRowCount: 0
        };

        this.ref = {
            modal: React.createRef()
        };
    }

    componentDidMount() {
        Main.printerList()
            .then(list => {
                this.setState({
                    printerList: list.map(item => {
                        return {
                            id: item.name,
                            text: item.name,
                            data: {
                                ...item,
                                fav: item.isDefault
                            }
                        }
                    })
                });
            });
    }

    render() {
        const {state, props} = this
        const {setting} = props;

        return <Page className={'PageSetting dis-f'} id={'PageSetting'}>
            <div className={'fb-20'} style={{letterSpacing: 10, fontSize: 20, fontWeight: 100, textAlign: 'left'}}><span style={{letterSpacing: 2}}>Developer: </span><span style={{backgroundColor: 'var(--light3)', borderRadius: 5, paddingLeft: 10}}>Farshad Mahmoudi</span></div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'debug-mood'} checked={setting.debugMood} onChange={this.checkChangeHandler.bind(this, 'debugMood')}/>
                <label htmlFor="debug-mood">سامانه روی حالت Debug Mood کار کند.</label>
            </div>
            <Input className={'fb-10 pad-8'} id={'server-domain'} placeholder={'آدرس سرور'} label={'آدرس سرور'} value={setting.serverDomain} onChange={this.inputChangeHandler.bind(this, 'serverDomain')}/>
            <Input className={'fb-10 pad-8'} id={'pos-server-ip'} placeholder={'آدرس IP دستگاه POS'} label={'آدرس IP دستگاه POS'} value={setting.posServerIp} onChange={this.inputChangeHandler.bind(this, 'posServerIp')}/>
            <Input className={'fb-20 pad-8'} id={'shafadoc-domain'} placeholder={'آدرس سرور شفاداک'} label={'آدرس سرور شفاداک'} value={setting.shafadocDomain} onChange={this.inputChangeHandler.bind(this, 'shafadocDomain')}/>
            <Input className={'fb-20 pad-8'} id={'shafadoc-kodakan-domain'} placeholder={'آدرس سرور شفاداک برای استعلام قیمت کودکان'} label={'آدرس سرور شفاداک برای استعلام قیمت کودکان'} value={setting.shafadocKoudakDomain} onChange={this.inputChangeHandler.bind(this, 'shafadocKoudakDomain')}/>
            <Input className={'fb-20 pad-8'} id={'result-path'} placeholder={'آدرس فایل result.json'} label={'آدرس فایل result.json'} value={setting.resultPath} onDoubleClick={this.resultBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'resultPath')}/>
            <Input className={'fb-20 pad-8'} id={'person-path'} placeholder={'آدرس فایل person.json'} label={'آدرس فایل person.json'} value={setting.personPath} onDoubleClick={this.personBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'personPath')}/>
            <Input className={'fb-20 pad-8'} id={'edge-shift-path'} placeholder={'آدرس فایل edgeShiftPath.json'} label={'آدرس فایل edgeShiftPath.json'} value={setting.edgeShiftPath} onDoubleClick={this.edgeShiftBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'edgeShiftPath')}/>
            <Input className={'fb-20 pad-8'} id={'insurance-map-path'} placeholder={'آدرس فایل نقشه بیمه های'} label={'آدرس فایل نقشه بیمه های'} value={setting.insuranceMapPath} onDoubleClick={this.insuranceMapBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'insuranceMapPath')}/>
            <Input className={'fb-20 pad-8'} id={'report-layout-path'} placeholder={'آدرس قالب چاپ قبض'} label={'آدرس قالب چاپ قبض'} value={setting.reportLayoutPath} onDoubleClick={this.reportLayoutBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'reportLayoutPath')}/>
            <Input className={'fb-20 pad-8'} id={'report2-layout-path'} placeholder={' آدرس قالب چاپ قبض حضوری'} label={' آدرس قالب چاپ قبض حضوری'} value={setting.report2LayoutPath} onDoubleClick={this.report2LayoutBrowsePath.bind(this)} onChange={this.inputChangeHandler.bind(this, 'report2LayoutPath')}/>
            <Input className={'fb-20 pad-8'} id={'foreign-client-prevent'} type={'text'} placeholder={'در صورت افزودن متن اجازه دریافت نوبت به بیماران اتباع داده نمی شود'} label={'در صورت افزودن متن اجازه دریافت نوبت به بیماران اتباع داده نمی شود'} value={setting.foreignClientPrevent} onChange={this.inputChangeHandler.bind(this, 'foreignClientPrevent')}/>
            <Input className={'fb-20 pad-8'} id={'shafadoc-porsant-prompt'} type={'text'} placeholder={'پیغام تاییدیه کمیسیون شفاداک که در هنگام پرداخت نمایش داده می شود'} label={'پیغام تاییدیه کمیسیون شفاداک که در هنگام پرداخت نمایش داده می شود'} value={setting.shafadocPorsantPrompt} onChange={this.inputChangeHandler.bind(this, 'shafadocPorsantPrompt')}/>
            <Input className={'fb-10 pad-8'} id={'national-code-usage-limit'} type={'number'} placeholder={'دفعات تکرار امکان استفاده از کدملی تکراری'} label={'دفعات تکرار امکان استفاده از کدملی تکراری'} value={setting.nationalCodeUsageLimit} onChange={this.inputChangeHandler.bind(this, 'nationalCodeUsageLimit')}/>
            <Input className={'fb-5 pad-8'} id={'node-id'} type={'number'} placeholder={'شماره مرکز'} label={'شماره مرکز'} value={setting.nodeId} onChange={this.inputChangeHandler.bind(this, 'nodeId')}/>
            <Input className={'fb-5 pad-8'} id={'kiosk-number'} type={'number'} placeholder={'شماره کیوسک'} label={'شماره کیوسک'} value={setting.kioskNumber} onChange={this.inputChangeHandler.bind(this, 'kioskNumber')}/>
            <Input className={'fb-5 pad-8'} id={'psychiatrist-id'} type={'number'} placeholder={'شناسه روانپزشک'} label={'شناسه روانپزشک'} value={setting.psychiatristId} onChange={this.inputChangeHandler.bind(this, 'psychiatristId')}/>
            <Input className={'fb-5 pad-8'} id={'foreigenerCode'} type={'number'} placeholder={'کد اتباع'} label={'کد اتباع'} value={setting.foreigenerCode} onChange={this.inputChangeHandler.bind(this, 'foreigenerCode')}/>
            <Input className={'fb-5 pad-8'} id={'foreigenerCodeAzad'} type={'number'} placeholder={'کد اتباع آزاد'} label={'کد اتباع آزاد'} value={setting.foreigenerCodeAzad} onChange={this.inputChangeHandler.bind(this, 'foreigenerCodeAzad')}/>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'national-code-validation-check'} checked={setting.nationalCodeValidationCheck} onChange={this.checkChangeHandler.bind(this, 'nationalCodeValidationCheck')}/>
                <label htmlFor="national-code-validation-check">بررسی صحت کدملی وارد شده.</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'multi-account-payment'} checked={setting.multiAccountPayment} onChange={this.checkChangeHandler.bind(this, 'multiAccountPayment')}/>
                <label htmlFor="multi-account-payment">پرداخت چند حسابی</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'generate-hid'} checked={setting.generateHID} onChange={this.checkChangeHandler.bind(this, 'generateHID')}/>
                <label htmlFor="generate-hid">صدور HID</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'samad-code-inquiry'} checked={setting.samadCodeInquiry} onChange={this.checkChangeHandler.bind(this, 'samadCodeInquiry')}/>
                <label htmlFor="samad-code-inquiry">اگر بیمه بیمار سلامت همگانی باشد کد رهگیری بیمار استعلام گردد.</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'patient-mobile'} checked={setting.patientMobile} onChange={this.checkChangeHandler.bind(this, 'patientMobile')}/>
                <label htmlFor="patient-mobile">دریافت شماره تلفن بیمار در فرآیند رزرو حضوری</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'send-sms-on-reserve'} checked={setting.sendSmsOnReserve} onChange={this.checkChangeHandler.bind(this, 'sendSmsOnReserve')}/>
                <label htmlFor="patient-mobile">در صورت دریافت نوبت برای روزهای آینده به تلفن همراه کاربر پیامک ارسال شود.</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'showChargeAmountReciept'} name={'showChargeAmountReciept'} checked={setting.showChargeAmountReciept} onChange={this.checkChangeHandler.bind(this,  'showChargeAmountReciept')}/>
                <label htmlFor="insurance-inquiry-type1">نمایش قیمت خدمات الکترونیکی در دریافت قبض</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'chargeAmount'} name={'chargeAmount'} checked={setting.chargeAmount} onChange={this.checkChangeHandler.bind(this,  'chargeAmount')}/>
                <label htmlFor="insurance-inquiry-type1">دریافت قیمت خدمات الکترونیکی در دریافت قبض</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'chargeAmountReserve'} name={'chargeAmountReserve'} checked={setting.chargeAmountReserve} onChange={this.checkChangeHandler.bind(this,  'chargeAmountReserve')}/>
                <label htmlFor="insurance-inquiry-type1">دریافت قیمت خدمات الکترونیکی در نوبت گیری</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'reservePrice'} name={'reservePrice'} checked={setting.reservePrice} onChange={this.checkChangeHandler.bind(this,  'reservePrice')}/>
                <label htmlFor="insurance-inquiry-type1">دریافت قیمت نوبت گیری</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'disableJari'} name={'disableJari'} checked={setting.disableJari} onChange={this.checkChangeHandler.bind(this,  'disableJari')}/>
                <label htmlFor="insurance-inquiry-type1">متوقف کردن رزرو روز جاری</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'disableFuture'} name={'disableFuture'} checked={setting.disableFuture} onChange={this.checkChangeHandler.bind(this,  'disableFuture')}/>
                <label htmlFor="insurance-inquiry-type1">متوقف کردن رزرو روز آینده</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'disableServices'} name={'disableServices'} checked={setting.disableServices} onChange={this.checkChangeHandler.bind(this,  'disableServices')}/>
                <label htmlFor="insurance-inquiry-type1">متوقف کردن دریافت خدمات پزشکی</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'getPsychiatristVisitTime'} name={'getPsychiatristVisitTime'} checked={setting.getPsychiatristVisitTime} onChange={this.checkChangeHandler.bind(this,  'getPsychiatristVisitTime')}/>
                <label htmlFor="insurance-inquiry-type1">بررسی دفعات مراجعه به روانپزشک</label>
            </div>
            <div className={'checkbox fb-20 pad-8'}>
                <input type="checkbox" id={'disableReciept'} name={'disableReciept'} checked={setting.disableReciept} onChange={this.checkChangeHandler.bind(this,  'disableReciept')}/>
                <label htmlFor="insurance-inquiry-type1">متوقف کردن دریافت قبض برای رزرو اینترنتی / تلفنی</label>
            </div>
            <div className={'checkbox fb-10 pad-8'}>
                <input type="checkbox" id={'insurance-inquiry-type1'} name={'insuranceInquiryType'} checked={setting.DITAS} onChange={this.checkChangeHandler.bind(this,  'DITAS')}/>
                <label htmlFor="insurance-inquiry-type1">استعلام از دیتاس 1 (توکن)</label>
            </div>
            <div className={'checkbox fb-10 pad-8'}>
                <input type="checkbox" id={'insurance-inquiry-type2'} name={'insuranceInquiryType'} checked={setting.DIRECT_INQUIRY} onChange={this.checkChangeHandler.bind(this,  'DIRECT_INQUIRY')}/>
                <label htmlFor="insurance-inquiry-type2">استعلام از دیتاس 2 (api)</label>
            </div>
            {/*<div className={'radio fb-10 pad-8'}>*/}
            {/*    <input type="radio" id={'insurance-inquiry-type1'} name={'insuranceInquiryType'} checked={setting.insuranceInquiryType === 'DITAS'} onChange={this.inputChangeHandler.bind(this, 'insuranceInquiryType', 'DITAS')}/>*/}
            {/*    <label htmlFor="insurance-inquiry-type1">استعلام از طریق دیتاس</label>*/}
            {/*</div>*/}
            {/*<div className={'radio fb-10 pad-8'}>*/}
            {/*    <input type="radio" id={'insurance-inquiry-type2'} name={'insuranceInquiryType'} checked={setting.insuranceInquiryType === 'DIRECT_INQUIRY'} onChange={this.inputChangeHandler.bind(this, 'insuranceInquiryType', 'DIRECT_INQUIRY')}/>*/}
            {/*    <label htmlFor="insurance-inquiry-type2">استعلام مستقیم از بیمه‌ها</label>*/}
            {/*</div>*/}
            <Input className={'fb-20 pad-8'} id={'back-to-main-menu-duration'} type={'number'} placeholder={'مدت زمان بازگشت به صفحه اصلی در صورت بی تحرکی'} label={'مدت زمان بازگشت به صفحه اصلی در صورت بی تحرکی'} value={setting.backToMainMenuDuration} onChange={this.inputChangeHandler.bind(this, 'backToMainMenuDuration')}/>
            {/*<select className={'fb-20 pad-8'} value={setting?.printerName} onChange={event => {*/}
            {/*    this.inputChangeHandler('printerName', event.target.value)*/}
            {/*}}>*/}
            {/*    {state.printerList.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}*/}
            {/*</select>*/}
            <Input className={'fb-13 pad-8'} id={'receipt-hospital-name'} type={'text'} placeholder={'نام بیمارستان روی قبض'} label={'نام بیمارستان روی قبض'} value={setting.receiptPrint.hospitalName} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.hospitalName')}/>
            <Input className={'fb-7 pad-8'} id={'receipt-print-duration'} type={'text'} placeholder={'مدت زمان چاپ قبش'} label={'مدت زمان چاپ قبض'} value={setting.receiptPrint.duration} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.duration')}/>
            <Input className={'fb-20 pad-8'} id={'receipt-description'} type={'text'} placeholder={'پیغام زیر قبض'} label={'پیغام زیر قبض'} value={setting.receiptPrint.description} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.description')}/>
            <Input className={'fb-5 pad-8'} id={'receipt-print-margin-top'} type={'number'} placeholder={'بالا'} label={'بالا'} value={setting.receiptPrint.margin.top} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.margin.top')}/>
            <Input className={'fb-5 pad-8'} id={'receipt-print-margin-bottom'} type={'number'} placeholder={'پایین'} label={'پایین'} value={setting.receiptPrint.margin.bottom} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.margin.bottom')}/>
            <Input className={'fb-5 pad-8'} id={'receipt-print-margin-left'} type={'number'} placeholder={'چپ'} label={'چپ'} value={setting.receiptPrint.margin.left} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.margin.left')}/>
            <Input className={'fb-5 pad-8'} id={'receipt-print-margin-right'} type={'number'} placeholder={'راست'} label={'راست'} value={setting.receiptPrint.margin.right} onChange={this.inputChangeHandler.bind(this, 'receiptPrint.margin.right')}/>
            <Button className={'mar-8'} theme={'red'} title={'بازگشت'} onClick={this.backClickHandler.bind(this)}/>
            <Button className={'mar-8'} theme={'yellow'} title={'صف رزرو'} onClick={this.goToQueue.bind(this)}/>
            <Button className={'mar-8'} theme={'blue'} title={'حذف unreserved'} onClick={this.clearUnreserved.bind(this)}/>
            <div className="flex">
            </div>
            <Button className={'mar-8'} theme={'red'} title={'بستن نرم‌افزار'} onClick={this.closeAppHandler.bind(this)}/>
        </Page>;
    }

    backClickHandler() {
        this.props.history.push(Resource.Route.HOME);

        window.location.reload();
    }

    checkChangeHandler(key, event) {
        const obj = {};
        obj[key] = event.target.checked;

        this.props.updateSetting(obj);
    }

    closeAppHandler() {
        Main.closeApp();
    }

    edgeShiftBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('edgeShiftPath', path);
            });
    }

    goToQueue() {
        this.props.history.push(Url.parse(Resource.Route.QUEUE,{type:'today'}));
    }

    clearUnreserved() {
        this.props.updateBase({unreserved:{}})
    }

    inputChangeHandler(key, value) {
        const keys = key.split('.');
        const setting = {...this.props.setting};

        if (keys.length === 1) {
            setting[key] = value;
        } else if (keys.length === 2) {
            if (!setting[keys[0]])
                setting[keys[0]] = {};
            setting[keys[0]][keys[1]] = value;
        } else if (keys.length === 3) {
            if (!setting[keys[0]])
                setting[keys[0]] = {};
            if (!setting[keys[0]][keys[1]])
                setting[keys[0]][keys[1]] = {};
            setting[keys[0]][keys[1]][keys[2]] = value;
        }

        this.props.updateSetting(setting);
    }

    insuranceMapBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('insuranceMapPath', path);
            });
    }

    personBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('personPath', path);
            });
    }

    report2LayoutBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('report2LayoutPath', path);
            });
    }

    reportLayoutBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('reportLayoutPath', path);
            });
    }

    resultBrowsePath() {
        Main.browse()
            .then(path => {
                if (path)
                    this.inputChangeHandler('resultPath', path);
            });
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSetting: props => dispatch(updateSetting(props)),
        updateBase: props => dispatch(updateBase(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageSetting);