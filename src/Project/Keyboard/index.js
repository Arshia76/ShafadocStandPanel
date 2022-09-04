import React from 'react';
import MyComponent from "../../Components/MyComponent";
import Button from '../../Components/Button'
import './index.css'
import Input from '../../Components/Input'

const englishKeyboard = () =>
    <React.Fragment>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
            <Button className={'mar-6'} theme={'blue'}>1</Button>
            <Button className={'mar-6'} theme={'blue'}>2</Button>
            <Button className={'mar-6'} theme={'blue'}>3</Button>
            <Button className={'mar-6'} theme={'blue'}>4</Button>
            <Button className={'mar-6'} theme={'blue'}>5</Button>
            <Button className={'mar-6'} theme={'blue'}>6</Button>
            <Button className={'mar-6'} theme={'blue'}>7</Button>
            <Button className={'mar-6'} theme={'blue'}>8</Button>
            <Button className={'mar-6'} theme={'blue'}>9</Button>
            <Button className={'mar-6'} theme={'blue'}>0</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
            <Button className={'mar-6'} theme={'blue'}>Tab</Button>
            <Button className={'mar-6'} theme={'blue'}>q</Button>
            <Button className={'mar-6'} theme={'blue'}>w</Button>
            <Button className={'mar-6'} theme={'blue'}>e</Button>
            <Button className={'mar-6'} theme={'blue'}>r</Button>
            <Button className={'mar-6'} theme={'blue'}>t</Button>
            <Button className={'mar-6'} theme={'blue'}>y</Button>
            <Button className={'mar-6'} theme={'blue'}>u</Button>
            <Button className={'mar-6'} theme={'blue'}>i</Button>
            <Button className={'mar-6'} theme={'blue'}>o</Button>
            <Button className={'mar-6'} theme={'blue'}>p</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
            <Button className={'mar-6'} theme={'blue'}>Caps Lock</Button>
            <Button className={'mar-6'} theme={'blue'}>a</Button>
            <Button className={'mar-6'} theme={'blue'}>s</Button>
            <Button className={'mar-6'} theme={'blue'}>d</Button>
            <Button className={'mar-6'} theme={'blue'}>f</Button>
            <Button className={'mar-6'} theme={'blue'}>g</Button>
            <Button className={'mar-6'} theme={'blue'}>h</Button>
            <Button className={'mar-6'} theme={'blue'}>j</Button>
            <Button className={'mar-6'} theme={'blue'}>k</Button>
            <Button className={'mar-6'} theme={'blue'}>l</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
            <Button className={'mar-6'} theme={'blue'}>Shift</Button>
            <Button className={'mar-6'} theme={'blue'}>z</Button>
            <Button className={'mar-6'} theme={'blue'}>x</Button>
            <Button className={'mar-6'} theme={'blue'}>c</Button>
            <Button className={'mar-6'} theme={'blue'}>v</Button>
            <Button className={'mar-6'} theme={'blue'}>b</Button>
            <Button className={'mar-6'} theme={'blue'}>n</Button>
            <Button className={'mar-6'} theme={'blue'}>m</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
            <Button className={'mar-6'} theme={'blue'}>Ctrl</Button>
            <Button className={'mar-6'} theme={'blue'}>Alt</Button>
            <Button className={'mar-6'} theme={'blue'}>Space</Button>
            <Button className={'mar-6'} theme={'blue'}>Ctrl</Button>
            <Button className={'mar-6'} theme={'blue'}>Alt</Button>
        </div>
    </React.Fragment>

const persianKeyboard = () =>
    <React.Fragment>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%', marginBottom: '20px'}}>
            <Input placeholder={'لطفا متن را وارد کنید'} type={'text'}/>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
            <Button className={'mar-6'} theme={'blue'}>1</Button>
            <Button className={'mar-6'} theme={'blue'}>2</Button>
            <Button className={'mar-6'} theme={'blue'}>3</Button>
            <Button className={'mar-6'} theme={'blue'}>4</Button>
            <Button className={'mar-6'} theme={'blue'}>5</Button>
            <Button className={'mar-6'} theme={'blue'}>6</Button>
            <Button className={'mar-6'} theme={'blue'}>7</Button>
            <Button className={'mar-6'} theme={'blue'}>8</Button>
            <Button className={'mar-6'} theme={'blue'}>9</Button>
            <Button className={'mar-6'} theme={'blue'}>0</Button>
            <Button className={'mar-6 fb-3'} theme={'blue'}>Backspace</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
            <Button className={'mar-6 fb-3'} theme={'blue'}>Tab</Button>
            <Button className={'mar-6'} theme={'blue'}>ض</Button>
            <Button className={'mar-6'} theme={'blue'}>ص</Button>
            <Button className={'mar-6'} theme={'blue'}>ث</Button>
            <Button className={'mar-6'} theme={'blue'}>ق</Button>
            <Button className={'mar-6'} theme={'blue'}>ف</Button>
            <Button className={'mar-6'} theme={'blue'}>غ</Button>
            <Button className={'mar-6'} theme={'blue'}>ع</Button>
            <Button className={'mar-6'} theme={'blue'}>ه</Button>
            <Button className={'mar-6'} theme={'blue'}>خ</Button>
            <Button className={'mar-6'} theme={'blue'}>ح</Button>
            <Button className={'mar-6'} theme={'blue'}>ج</Button>
            <Button className={'mar-6'} theme={'blue'}>چ</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
            <Button className={'mar-6'} theme={'blue'}>Caps Lock</Button>
            <Button className={'mar-6'} theme={'blue'}>ش</Button>
            <Button className={'mar-6'} theme={'blue'}>س</Button>
            <Button className={'mar-6'} theme={'blue'}>ی</Button>
            <Button className={'mar-6'} theme={'blue'}>ب</Button>
            <Button className={'mar-6'} theme={'blue'}>ل</Button>
            <Button className={'mar-6'} theme={'blue'}>ا</Button>
            <Button className={'mar-6'} theme={'blue'}>ت</Button>
            <Button className={'mar-6'} theme={'blue'}>ن</Button>
            <Button className={'mar-6'} theme={'blue'}>م</Button>
            <Button className={'mar-6'} theme={'blue'}>ک</Button>
            <Button className={'mar-6'} theme={'blue'}>گ</Button>
        </div>
        <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
            <Button className={'mar-6 fb-4'} theme={'blue'}>Shift</Button>
            <Button className={'mar-6'} theme={'blue'}>ظ</Button>
            <Button className={'mar-6'} theme={'blue'}>ط</Button>
            <Button className={'mar-6'} theme={'blue'}>ز</Button>
            <Button className={'mar-6'} theme={'blue'}>ر</Button>
            <Button className={'mar-6'} theme={'blue'}>ژ</Button>
            <Button className={'mar-6'} theme={'blue'}>ذ</Button>
            <Button className={'mar-6'} theme={'blue'}>د</Button>
            <Button className={'mar-6'} theme={'blue'}>ئ</Button>
            <Button className={'mar-6'} theme={'blue'}>و</Button>
        </div>
        <div className={'dis-f '} style={{flexDirection: 'row-reverse', width: '100%'}}>
            <Button className={'mar-6'} theme={'blue'}>Ctrl</Button>
            <Button className={'mar-6'} theme={'blue'}>Alt</Button>
            <Button className={'mar-6 fb-10'} theme={'blue'}>Space</Button>
            <Button className={'mar-6'} theme={'blue'}>Ctrl</Button>
            <Button className={'mar-6'} theme={'blue'}>Alt</Button>
        </div>
    </React.Fragment>

class Keyboard extends MyComponent {

    constructor(props) {
        super(props);
        this.state = {
            input: [],
            cursorPosition: 0,
            value: ''
        }
    }

    onClick = (e) => {
        this.setState({input: [...this.state.input, e.target.innerText]})
    }

    onClear = _ => {
        this.state.input.pop(this.state.input.length - 1)
        this.setState({input: [...this.state.input]})
    }

    onSpace = _ => {
        this.setState({input: [...this.state.input, ' ']})
    }


    persianKeyboard = () =>
        <React.Fragment>
            <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%', marginBottom: '20px'}}>
                <Input onChange={this.set} value={this.state.input.join('')}
                       placeholder={this.props.placeholder}
                       type={'text'}/>
            </div>
            <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
                <Button onClick={this.onClick} className={'mar-6  flex'} theme={'blue'}>1</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>2</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>3</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>4</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>5</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>6</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>7</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>8</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>9</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>0</Button>
                <Button onClick={this.onClear} className={'mar-6 flex fb-3'} theme={'blue'}>پاک کردن</Button>
            </div>
            <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ض</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ص</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ث</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ق</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ف</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>غ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ع</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ه</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>خ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ح</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ج</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>چ</Button>
            </div>
            <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ش</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>س</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ی</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ب</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ل</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ا</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ت</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ن</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>م</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ک</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>گ</Button>
            </div>
            <div className={'dis-f'} style={{flexDirection: 'row-reverse', width: '100%'}}>{/*<Button onClick={this.onClick} className={'mar-6 flex fb-4'} theme={'blue'} >Shift</Button>*/}
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ظ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ط</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ز</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ر</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ژ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ذ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>د</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>ئ</Button>
                <Button onClick={this.onClick} className={'mar-6 flex'} theme={'blue'}>و</Button>
            </div>
            <div className={'dis-f '} style={{flexDirection: 'row-reverse', width: '100%'}}>
                <Button onClick={this.props.onClick} className={'mar-6 flex'} theme={'green'}>بازگشت</Button>
                <Button
                    onClick={this.onSpace} className={'mar-6 flex fb-8'} theme={'blue'}>فاصله</Button>
                <Button onClick={this.props.submit} className={'mar-6 flex'} theme={'blue'}>ثبت</Button>

            </div>
        </React.Fragment>

    render() {
        const {
            props
        } = this;
        return (
            <div className={'dis-f'} style={{flexDirection: 'row-reverse'}}>
                {this.persianKeyboard()}
            </div>
        );
    }
}

export default Keyboard;