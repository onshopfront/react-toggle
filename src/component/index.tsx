import React, { PureComponent } from 'react'
import Check from './check'
import X from './x'
import { pointerCoord } from './util'

interface Props {
    checked: boolean,
    disabled: boolean,
    defaultChecked: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus: (e: React.FocusEvent) => void;
    onBlur: (e: React.FocusEvent) => void;
    className: string;
    name: string;
    value: string;
    id: string;
    "aria-labelledby": string;
    "aria-label": string;
    icons: false | {
        checked: React.ReactNode,
        unchecked: React.ReactNode,
    }
}

interface State {
    checked: boolean;
    hasFocus: boolean;
}

export default class Toggle extends PureComponent<Partial<Props>, State> {
    public static displayName = "Toggle";
    public static defaultProps = {
        icons: {
            checked: <Check/>,
            unchecked: <X/>,
        },
    }

    protected previouslyChecked: boolean;
    protected inputRef = React.createRef<HTMLInputElement>();
    protected moved = false;
    protected startX: null | number = null;
    protected activated = false;

    static getDerivedStateFromProps(nextProps: Partial<Props>) {
        if ('checked' in nextProps) {
            return { checked: !!nextProps.checked }
        }

        return null
    }

    constructor(props: Partial<Props>) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.previouslyChecked = !!(props.checked || props.defaultChecked)
        this.state = {
            checked: !!(props.checked || props.defaultChecked),
            hasFocus: false,
        }
    }

    handleClick(event: React.MouseEvent) {
        const checkbox = this.inputRef.current
        if (!checkbox) return
        if (event.target !== checkbox && !this.moved) {
            this.previouslyChecked = checkbox.checked
            event.preventDefault()
            checkbox.focus()
            checkbox.click()
            return
        }

        const checked = this.props.hasOwnProperty('checked') ? !!this.props.checked : checkbox.checked

        this.setState({ checked })
    }

    handleTouchStart(event: React.TouchEvent) {
        this.startX = pointerCoord(event).x
        this.activated = true
    }

    handleTouchMove(event: React.TouchEvent) {
        if (!this.activated) return
        this.moved = true

        if (this.startX) {
            let currentX = pointerCoord(event).x
            if (this.state.checked && currentX + 15 < this.startX) {
                this.setState({ checked: false })
                this.startX = currentX
                this.activated = true
            } else if (currentX - 15 > this.startX) {
                this.setState({ checked: true })
                this.startX = currentX
                this.activated = (currentX < this.startX + 5)
            }
        }
    }

    handleTouchEnd(event: React.TouchEvent) {
        if (!this.moved) return
        const checkbox = this.inputRef.current
        if (!checkbox) return
        event.preventDefault()

        if (this.startX) {
            let endX = pointerCoord(event).x
            if (this.previouslyChecked && this.startX + 4 > endX) {
                if (this.previouslyChecked !== this.state.checked) {
                    this.setState({ checked: false })
                    this.previouslyChecked = this.state.checked
                    checkbox.click()
                }
            } else if (this.startX - 4 < endX) {
                if (this.previouslyChecked !== this.state.checked) {
                    this.setState({ checked: true })
                    this.previouslyChecked = this.state.checked
                    checkbox.click()
                }
            }

            this.activated = false
            this.startX = null
            this.moved = false
        }
    }

    handleFocus(event: React.FocusEvent) {
        const { onFocus } = this.props

        if (onFocus) {
            onFocus(event)
        }

        this.setState({ hasFocus: true })
    }

    handleBlur(event: React.FocusEvent) {
        const { onBlur } = this.props

        if (onBlur) {
            onBlur(event)
        }

        this.setState({ hasFocus: false })
    }

    getIcon(type: "checked" | "unchecked") {
        const { icons } = this.props
        if (!icons) {
            return null
        }
        return typeof icons[type] === undefined
            ? Toggle.defaultProps.icons[type]
            : icons[type]
    }

    render() {
        const { className, icons: _icons, ...inputProps } = this.props

        const classes = [
            "react-toggle",
        ];

        if (this.state.checked) {
            classes.push("react-toggle--checked");
        }

        if (this.state.hasFocus) {
            classes.push("react-toggle--focus");
        }

        if (this.props.disabled) {
            classes.push("react-toggle--disabled");
        }

        if (className) {
            classes.push(className);
        }

        return (
            <div
                className={classes.join(" ")}
                data-testid="toggle-wrapper"
                onClick={this.handleClick}
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
            >
                <div className='react-toggle-track'>
                    <div
                        data-testid="toggle-track-check"
                        className='react-toggle-track-check'
                    >
                        {this.getIcon('checked')}
                    </div>
                    <div
                        data-testid="toggle-track-x"
                        className='react-toggle-track-x'
                    >
                        {this.getIcon('unchecked')}
                    </div>
                </div>
                <div className='react-toggle-thumb'/>

                <input
                    {...inputProps}
                    ref={this.inputRef}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    className='react-toggle-screenreader-only'
                    type='checkbox'
                />
            </div>
        )
    }
}
