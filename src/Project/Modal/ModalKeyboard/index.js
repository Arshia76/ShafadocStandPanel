import React from 'react';
import MyComponent from "../../../Components/MyComponent";
import './ModalKeyboard.css'
import Modal, {ModalContent} from "../../../Components/Modal";
import BackToMainMenu from "../../../backToMainMenu";
import Resource from "../../../Resource";
import Notif from "../../../Components/Notif";
import {addNationalCode, updateUserDataEntry} from "../../../Redux/Actions/base";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import Input from "../../../Components/Input";
import Button from "../../../Components/Button";


class ModalKeyboard extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            resolve: _ => null,
            reject: _ => null,
            fields: {},
        };

        this.ref = {
            modal: React.createRef(),
            insert: React.createRef(),
            close: React.createRef(),
            input: React.createRef()
        };
    }

    static defaultProps = {
        onSuccess: _ => null,
        onClose: _ => null
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.refer({current: this});
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.timer === 1)
            this.backToMainMenu();

        return true;
    }

    render() {
        const {state} = this;
        const {fields} = state;
        return (
            <Modal ref={this.ref.modal}
                   className={'ModalKeyboard'}
                   name={'ModalKeyboard'}
                   size={'large'}
                   required={true}
                   error={state.error}>
                <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                    <React.Fragment>
                        <div className={'row'}><h3 style={{fontSize: '20px'}}>{state.prompt}</h3></div>
                        <div className={'dis-f '} style={{flexDirection: 'row-reverse', width: '100%'}}>
                            <Input readOnly={true} className={'mar-6 flex'} ref={this.ref.input} onChange={this.setField.bind(this, 'code')}
                                   placeholder={this.state.placeholder}
                                   type={'text'}
                                   value={fields.code}/>
                            <Button onClick={this.clear.bind(this)} ref={this.ref.clear} className={'mar-6'} theme={'red'} style={{lineHeight: '32px'}}>پاک کردن</Button>
                        </div>
                        {/*<div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>*/}
                        {/*    <Button onClick={this.insert.bind(this, '1')} className={'mar-6  flex'}*/}
                        {/*            theme={'blue'}>1</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '2')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>2</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '3')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>3</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '4')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>4</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '5')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>5</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '6')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>6</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '7')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>7</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '8')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>8</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '9')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>9</Button>*/}
                        {/*    <Button onClick={this.insert.bind(this, '0')} className={'mar-6 flex'}*/}
                        {/*            theme={'blue'}>0</Button>*/}

                        {/*</div>*/}
                        <div className={'dis-f'} style={{width: '100%'}}>
                            <Button onClick={this.insert.bind(this, 'پ')} className={'mar-6 flex'} theme={'blue'}>پ</Button>
                            <Button onClick={this.insert.bind(this, 'چ')} className={'mar-6 flex'} theme={'blue'}>چ</Button>
                            <Button onClick={this.insert.bind(this, 'ج')} className={'mar-6 flex'} theme={'blue'}>ج</Button>
                            <Button onClick={this.insert.bind(this, 'ح')} className={'mar-6 flex'} theme={'blue'}>ح</Button>
                            <Button onClick={this.insert.bind(this, 'خ')} className={'mar-6 flex'} theme={'blue'}>خ</Button>
                            <Button onClick={this.insert.bind(this, 'ه')} className={'mar-6 flex'} theme={'blue'}>ه</Button>
                            <Button onClick={this.insert.bind(this, 'ع')} className={'mar-6 flex'} theme={'blue'}>ع</Button>
                            <Button onClick={this.insert.bind(this, 'غ')} className={'mar-6 flex'} theme={'blue'}>غ</Button>
                            <Button onClick={this.insert.bind(this, 'ف')} className={'mar-6 flex'} theme={'blue'}>ف</Button>
                            <Button onClick={this.insert.bind(this, 'ق')} className={'mar-6 flex'} theme={'blue'}>ق</Button>
                            <Button onClick={this.insert.bind(this, 'ث')} className={'mar-6 flex'} theme={'blue'}>ث</Button>
                            <Button onClick={this.insert.bind(this, 'ص')} className={'mar-6 flex'} theme={'blue'}>ص</Button>
                            <Button onClick={this.insert.bind(this, 'ض')} className={'mar-6 flex'} theme={'blue'}>ض</Button>
                        </div>
                        <div className={'dis-f'} style={{width: '100%'}}>
                            <Button onClick={this.insert.bind(this, 'گ')} className={'mar-6 flex'} theme={'blue'}>گ</Button>
                            <Button onClick={this.insert.bind(this, 'ک')} className={'mar-6 flex'} theme={'blue'}>ک</Button>
                            <Button onClick={this.insert.bind(this, 'م')} className={'mar-6 flex'} theme={'blue'}>م</Button>
                            <Button onClick={this.insert.bind(this, 'ن')} className={'mar-6 flex'} theme={'blue'}>ن</Button>
                            <Button onClick={this.insert.bind(this, 'ت')} className={'mar-6 flex'} theme={'blue'}>ت</Button>
                            <Button onClick={this.insert.bind(this, 'ا')} className={'mar-6 flex'} theme={'blue'}>ا</Button>
                            <Button onClick={this.insert.bind(this, 'آ')} className={'mar-6 flex'} theme={'blue'}>آ</Button>
                            <Button onClick={this.insert.bind(this, 'ل')} className={'mar-6 flex'} theme={'blue'}>ل</Button>
                            <Button onClick={this.insert.bind(this, 'ب')} className={'mar-6 flex'} theme={'blue'}>ب</Button>
                            <Button onClick={this.insert.bind(this, 'ی')} className={'mar-6 flex'} theme={'blue'}>ی</Button>
                            <Button onClick={this.insert.bind(this, 'س')} className={'mar-6 flex'} theme={'blue'}>س</Button>
                            <Button onClick={this.insert.bind(this, 'ش')} className={'mar-6 flex'} theme={'blue'}>ش</Button>
                        </div>
                        <div className={'dis-f'} style={{width: '100%'}}>
                            <Button onClick={this.insert.bind(this, 'و')} className={'mar-6 flex'} theme={'blue'}>و</Button>
                            <Button onClick={this.insert.bind(this, 'ئ')} className={'mar-6 flex'} theme={'blue'}>ئ</Button>
                            <Button onClick={this.insert.bind(this, 'د')} className={'mar-6 flex'} theme={'blue'}>د</Button>
                            <Button onClick={this.insert.bind(this, 'ذ')} className={'mar-6 flex'} theme={'blue'}>ذ</Button>
                            <Button onClick={this.insert.bind(this, 'ر')} className={'mar-6 flex'} theme={'blue'}>ر</Button>
                            <Button onClick={this.insert.bind(this, 'ز')} className={'mar-6 flex'} theme={'blue'}>ز</Button>
                            <Button onClick={this.insert.bind(this, 'ژ')} className={'mar-6 flex'} theme={'blue'}>ژ</Button>
                            <Button onClick={this.insert.bind(this, 'ط')} className={'mar-6 flex'} theme={'blue'}>ط</Button>
                            <Button onClick={this.insert.bind(this, 'ظ')} className={'mar-6 flex'} theme={'blue'}>ظ</Button>
                        </div>
                        <div className={'dis-f '} style={{flexDirection: 'row-reverse', width: '100%'}}>
                            <Button onClick={this.backToMainMenu.bind(this)} className={'mar-6 flex'} theme={'red'}>بازگشت</Button>
                            <Button onClick={this.insert.bind(this, ' ')} className={'mar-6 flex fb-8'} theme={'blue'}>فاصله</Button>
                            <Button onClick={this.submit.bind(this)} className={'mar-6 flex'} theme={'green'}>ثبت</Button>
                        </div>
                    </React.Fragment>
                </ModalContent>
            </Modal>
        );
    }

    backToMainMenu() {
        const {props} = this;

        this.close(false);

        setTimeout(_ => {
            props.history.push(Resource.Route.HOME);
        }, 500);
    }

    clear() {
        const fields = {...this.state.fields};

        fields.code = (fields.code || '').toString().slice(0, -1);

        this.setState({fields});
    }

    close(success) {
        const {state} = this;

        BackToMainMenu.clearTimer();

        this.ref.modal.current.close()
            .then(_ => {
                this.props.onClose(state.key, state.fields?.code || null);

                if (success === true)
                    state.resolve({key: state.key, value: state.fields.code});
                else
                    state.reject();
            });
    }

    insert(char) {
        const fields = {...this.state.fields};

        fields.code = (fields.code || '') + char;

        this.setState({fields});
    }

    open(data = {key: null, prompt: 'وارد کنید...', validator: _ => true}, action) {
        return new Promise((resolve, reject) => {
            BackToMainMenu.setTimer(this);

            this.setState({
                resolve,
                reject,
                data,
                action,
                key: data.key,
                prompt: data.prompt,
                validator: data.validator,
                fields: {},
                error: null
            });

            return this.ref.modal.current.open()
                .then(_ => {
                    setTimeout(_ => {
                        if (this.ref.input.current)
                            this.ref.input.current.focus();
                    }, 500);
                });
        });
    }

    submit() {
        const {state} = this;
        const code = state.fields.code;
        const result = state.validator(code);


        if (result === true) {
            this.close(true);
        } else {
            new Notif({message: result, theme: 'error'}).show();
        }
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addNationalCode: nationalCode => dispatch(addNationalCode(nationalCode)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalKeyboard));