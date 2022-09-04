import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';
import App from "../../App";

const modals = [];
const DIR = {
    FORWARD: 'FORWARD',
    BACKWARD: 'BACKWARD'
};
const ModalAction = {
    VIEW: 'VIEW',
    UPDATE: 'UPDATE',
    INSERT: 'INSERT',
    DELETE: 'DELETE',
    SCAN: 'SCAN'
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 27) {
        const props = modals[modals.length - 1]?.props;

        if (props && props.closeOnEscape) {
            if (props.onCloseRequest) {
                props.onCloseRequest();
                props.onClose();
            } else {
                modals[modals.length - 1].close();
                props.onClose();
            }
        }
    }
});

class Modal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            preShow: false,
            show: false,
            loading: props.loading,
            error: props.error,
            shake: props.shake
        };
    }

    static defaultProps = {
        name: null,
        title: null,
        description: null,
        size: 'medium',
        className: null,
        style: null,
        required: false,
        controls: null,
        closeOnEscape: true,
        error: null,
        loading: null,
        onOpen: _ => null,
        onShow: _ => null,
        onHide: _ => null,
        onClose: _ => null,
        onCloseRequest: null
    };

    static propTypes = {
        name: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large', 'wide']),
        className: PropTypes.string,
        style: PropTypes.object,
        required: PropTypes.bool,
        controls: PropTypes.any,
        closeOnEscape: PropTypes.any,
        error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        onOpen: PropTypes.func,
        onShow: PropTypes.func,
        onHide: PropTypes.func,
        onClose: PropTypes.func,
        onCloseRequest: PropTypes.func
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        this.props.error !== nextProps.error && (nextState.error = nextProps.error);
        this.props.loading !== nextProps.loading && (nextState.loading = nextProps.loading);

        return this.state.show !== nextState.show ||
            this.state.preShow !== nextState.preShow ||
            this.state.open !== nextState.open ||
            this.state.loading !== nextState.loading ||
            this.state.error !== nextState.error ||
            this.state.shake !== nextState.shake ||
            this.props.children !== nextProps.children;
    }

    render() {
        if (!this.state.open)
            return null;

        const classes = ['Modal'];

        this.props.className && classes.push(this.props.className);
        this.props.size && classes.push(this.props.size);
        this.state.preShow && classes.push('pre-show');
        this.state.show && classes.push('show');
        this.state.loading && classes.push('loading');
        this.state.shake && classes.push('shake');

        try {
            // controls = this.props.children.filter(item => item.type.name === modalControlName);
        } catch (e) {
        }

        return ReactDOM.createPortal(<div className={classes.join(' ')} id={this.props.name} onClick={this.props.required ? this.modalPreventClickHandler.bind(this) : this.discardModal.bind(this)}>
                <div className="Modal-body" style={this.props.style} onClick={this.modalPreventClickHandler.bind(this)}>
                    {(this.props.title || this.props.description) &&
                    <div className={'Modal-header'}>
                        {this.props.title && <ModalTitle>{this.props.title}</ModalTitle>}
                        {this.props.description && <ModalDescription>{this.props.description}</ModalDescription>}
                    </div>}
                    {this.props.children}
                    {/*<div className={'Modal-shadow'}>*/}
                    {/*    {controls && <div style={{display: 'flex', flexWrap: 'wrap'}}>*/}
                    {/*        <div className="flex dis-f">*/}
                    {/*            {this.state.error && !this.state.loading && <ModalError style={errorStyle}>{this.state.error}</ModalError>}*/}
                    {/*            {this.state.loading && <ModalLoading>{this.state.loading}</ModalLoading>}*/}
                    {/*        </div>*/}
                    {/*        {controls}*/}
                    {/*    </div>}*/}
                    {/*</div>*/}
                </div>
            </div>
            , document.getElementById('root'));
    }

    close() {
        return new Promise((resolve, reject) => {
            if (!this.state.open) {
                App.log('Modal', `${this.props.name || 'Modal'} already closed.`);
                resolve();
                return;
            }

            this.hide().then(_ => {
                this.setState({open: false}, _ => {
                    App.log('Close', this.props.name || 'Modal');
                    modals.pop();
                    this.props.onClose();

                    if (modals.length !== 0)
                        modals[modals.length - 1].show(DIR.BACKWARD);

                    resolve();
                });
            });
        });
    }

    discardModal() {
        this.props.onClose();

        this.close();
    }

    error(message = null) {
        this.setState({error: message});
    }

    hide() {
        return new Promise((resolve, reject) => {
            if (!this.state.preShow || !this.state.show) {
                App.log('Modal', `${this.props.name || 'Modal'} already hided.`);
                resolve();
                return;
            }

            this.setState({show: false}, _ => {
                setTimeout(_ => {
                    this.setState({preShow: false}, _ => {
                        App.log('Hide', this.props.name || 'Modal');
                        this.props.onHide();

                        setTimeout(_ => {
                            resolve();
                        }, 100);
                    });
                }, 100);
            });
        });
    }

    loading(state = this.state.loading ? null : 'در حال بارگذاری') {
        if (state === true)
            state = 'در حال بارگذاری';
        else if (state === false)
            state = null;
        this.setState({loading: state});
    }

    modalPreventClickHandler(event) {
        if (event.target.className.split(' ').includes('Modal')) {
            if (!this.state.shake) {
                this.setState({shake: true});
                App.setUniqueTimeout(_ => {
                    this.setState({shake: false});
                }, 500);
            }
        }
        event.stopPropagation();
    }

    open() {
        return new Promise((resolve, reject) => {
            if (this.state.open) {
                App.log('Modal', `${this.props.name || 'Modal'} already opened.`);
                resolve();
                return;
            }

            this.setState({open: true}, _ => {
                console.log('state')
                App.log('Open', this.props.name || 'Modal');
                this.props.onOpen();

                this.show(DIR.FORWARD).then(_ => {
                    resolve();
                });
            });
        });
    }

    show(direction) {
        return new Promise((resolve, reject) => {
            const doit = _ => {
                if (direction === DIR.FORWARD)
                    modals.push(this);

                this.setState({preShow: true}, _ => {
                    setTimeout(_ => {
                        this.setState({show: true}, _ => {
                            App.log('Show', this.props.name || 'Modal');
                            this.props.onShow();

                            if (this.props.closeOnEscape && !this.props.onCloseRequest)
                                App.log('Modal', `${this.props.name || 'Modal'} enabled closeOnEscape functionality but doesn't assigned onCloseRequest function. this may cause som on predictable issues`);

                            resolve();
                        });
                    }, 100);
                });
            };

            if (this.state.preShow || this.state.show) {
                App.log('Modal',
                    `${this.props.name || 'Modal'} already showed.`
                    ,);
                resolve();
            }

            if (modals.length !== 0 && direction === DIR.FORWARD)
                modals[modals.length - 1].hide().then(_ => {
                    doit();
                });
            else
                doit();
        });
    }
}

const ModalContent = props => <div className="Modal-content" style={props.style} onClick={props?.onClick}>{props.children}</div>;

const ModalTitle = props => <p className="Modal-title">{props.children}</p>;

const ModalDescription = props => <p className="Modal-description">{props.children}</p>;

const ModalControls = props => <div className="Modal-controls">{props.children}</div>;

// const ModalError = props => {
//     return <p className="Modal-error" style={props.style}>{props.children}</p>;
// };

// const ModalLoading = props => <div className="Modal-loading" style={{backgroundImage: `url(${Resource.IMAGE.LOADER_BLACK})`}}>{props.children}</div>;

export default Modal;
export {ModalContent, ModalControls, ModalAction, modals};