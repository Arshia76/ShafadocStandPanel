import {Var} from "../../App";
import './index.css';
import Resource from "../../Resource";
import {Howl} from 'howler';

class Notif {
    constructor(props = '') {
        if (typeof props === "string")
            props = {message: props || ''};

        this.checkParent();

        this.props = {
            id: `notification_${Var.shuffle('string', 6)}`,
            message: props.message || '',
            theme: props.theme || 'basic',
            duration: props.duration === null ? null : props.duration || 5,
            icon: props.icon || null,
            audio: props.audio === undefined ? true : props.audio,
            onClick: props.onClick || (_ => null),
            onShow: props.onShow || (_ => null),
            onHide: props.onHide || (_ => null)
        };

        this.elem = null;
        this.timer = null;
        this.interval = null;
    }

    render() {
        const {props} = this;
        const classes = ['Notif', props.theme, props.icon ? 'icon' : ''];
        const elem = document.createElement('div');
        const timer = document.createElement('div');

        timer.classList.add('timer');
        timer.setAttribute('style', `animation-duration: ${props.duration || 0}s`);

        elem.setAttribute('class', classes.join(' '));
        elem.setAttribute('id', props.id);
        elem.innerHTML = (props.icon ? `<img class="Notif-icon" src="${props.icon}"/>` : '') + `<p class="Notif-content">${props.message}</p>`;

        elem.appendChild(timer);
        elem.onclick = _ => {
            props.onClick();

            this.hide();
        };

        return {elem, timer};
    }

    checkParent() {
        let parent = document.getElementById('notification-root');
        let root = document.getElementsByTagName('body')[0];

        if (!parent) {
            parent = document.createElement('div');
            parent.setAttribute('id', 'notification-root');
            root.appendChild(parent);
        }
    }

    hide() {
        const parent = document.getElementById('notification-root');

        if (this.elem) {
            this.props.onHide();

            this.elem.classList.remove('show');
            setTimeout(_ => {
                if (this.elem) {
                    parent.removeChild(this.elem);
                    this.elem = null;
                }
            }, 300);
        }

        if (this.interval)
            clearInterval(this.interval);
    }

    show() {
        const {elem, timer} = this.render();
        const parent = document.getElementById('notification-root');

        this.elem = elem;
        this.timer = timer;

        parent.append(this.elem);

        setTimeout(_ => {
            this.elem.classList.add('show');

            if (this.props.audio) {
                const sound = new Howl({
                    src: [Resource.AUDIO.NOTIFICATION2]
                });

                sound.play();
            }

            this.props.onShow();

            if (this.props.duration) {
                // setTimeout(_ => {
                this.interval = setInterval(_ => {
                    if (this.elem.offsetWidth === this.timer.offsetWidth) {
                        this.hide();
                    }
                }, 100);
                // }, this.props.duration * 1000);
            }
        }, 300);
    }
}

export default Notif