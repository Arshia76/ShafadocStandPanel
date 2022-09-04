/* eslint eqeqeq: off */
import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import './index.css';
import Modal, {ModalContent} from '../../../Components/Modal';
import Button from '../../../Components/Button';
import Resource from '../../../Resource';
import Input from '../../../Components/Input';
import {connect} from 'react-redux';
import {addNationalCode, updateUserDataEntry} from '../../../Redux/Actions/base';
import BackToMainMenu from "../../../backToMainMenu";
import {withRouter} from "react-router-dom";
import Notif from "../../../Components/Notif";
import BarcodeReader from 'react-barcode-reader'

class ModalNumberKeyboard extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            resolve: _ => null,
            reject: _ => null,
            fields: {}
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

        return <Modal ref={this.ref.modal}
                      name={'ModalNumberKeyboard'}
                      size={'medium'}
                      required={true}
                      error={state.error}>


            <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                <BarcodeReader
                    onError={this.handleError.bind(this)}
                    onScan={this.handleScan.bind(this)}
                />
                <div className={'row'}><h3 style={{fontSize: '20px'}}>{state.prompt}</h3></div>
                <div className={'dis-f'}>
                    <div className="fb-8 dis-f pad-4">
                        <Button className={'fb-20'} theme="red" title={'پاک کردن'} onClick={this.clear.bind(this)} ref={this.ref.clear} style={{lineHeight: '32px'}}/>
                    </div>
                    <Input  readOnly={true} ref={this.ref.input} placeholder={state.placeholder} className={'input fb-12 pad-4'} align={'center'} direction={'ltr'} type="text" mask={state.mask} value={fields.code} style={{fontSize: '30px'}}  onChange={this.setField.bind(this, 'code')}/>
                </div>
                <div className={'dis-f'} style={{flexDirection: 'column', width: '100%'}}>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '3')} theme="blue">3</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '2')} theme="blue">2</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '1')} theme="blue">1</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '6')}
                                theme="blue">6</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '5')}
                                theme="blue">5</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '4')}
                                theme="blue">4</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '9')}
                                theme="blue">9</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '8')}
                                theme="blue">8</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '7')}
                                theme="blue">7</Button>
                    </div>
                    <div className={'dis-f'}>
                        <Button className={'flex mar-4'} onClick={this.submit.bind(this)} theme="green">ثبت</Button>
                        <Button className={'flex buttons mar-4'} onClick={this.insert.bind(this, '0')} theme="blue">0</Button>
                        <Button className={'flex mar-4'} onClick={this.backToMainMenu.bind(this)} theme="red">بازگشت</Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>;
    }

    handleScan(data){
        const {updateUserDataEntry} = this.props;
        this.setState({fields:{code:data}},() => {
            this.submit()
        })
        updateUserDataEntry({
            nationalCode:data
        })
    }

    handleError(err){
        alert(err)
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

        this.ref.modal.current.close();

        this.props.onClose(state.key, state.fields?.code || null);

        if (success === true) {
            this.props.onSuccess(state.key, state.fields.code);
            state.resolve({key: state.key, value: state.fields.code});
        } else {
            state.reject();
        }
    }

    insert($char) {
        const fields = {...this.state.fields};

        fields.code = (fields.code || '') + $char;

        if(this.props.base.userDataEntry.nationality === 'IRANIAN' && this.state.key !== 'mobile' && this.state.key !== 'birth' && fields.code.length <=10 ) {
            this.setState({fields});
        }
        else if((this.props.base.userDataEntry.nationality === 'FOREIGN' && this.state.key !== 'mobile') || this.state.key === 'mobile' ) {
            this.setState({fields});
        }
        else if (this.state.key === 'birth' && fields.code.length <=8) {
            this.setState({fields});
        }
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
                placeholder:data.placeholder,
                validator: data.validator,
                mask: data.mask,
                fields: {},
                error: null
            });

            return this.ref.modal.current.open()
                .then(_ => {
                    // setTimeout(_ => {
                    //     if (this.ref.input.current)
                    //         this.ref.input.current.focus();
                    // }, 500);
                    console.log(true)
                });
        });
    }

    submit() {
        const code = this.state.fields.code;
        const {state} = this;
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalNumberKeyboard));