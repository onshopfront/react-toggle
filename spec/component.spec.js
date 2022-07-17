/* eslint-disable no-unused-expressions */
// eslint-disable-next-line no-unused-vars
import React from 'react'
// eslint-disable-next-line no-unused-vars
import Toggle from '../dist/component'
import { render, screen, fireEvent } from '@testing-library/react'

const noop = () => {}

const classNames = {
  base: 'react-toggle',
  focus: 'react-toggle--focus',
  checked: 'react-toggle--checked',
  disabled: 'react-toggle--disabled',
}

describe('Component', () => {
  const className = 'foobar'

  test('sets state/input-value based on `checked`-prop', () => {
    const { rerender } = render(
      <Toggle
        onChange={noop}
        checked={false}
      />,
    )

    expect(screen.getByRole('checkbox')).not.toBeChecked()

    rerender(
      <Toggle
        onChange={noop}
        checked={true}
      />,
    )

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  test('accepts a className as a prop', () => {
    render(<Toggle className={className}/>)

    expect(screen.getByTestId('toggle-wrapper')).toHaveClass(className)
  })

  test('does not pass the custom className to the checkbox', () => {
    render(<Toggle className={className}/>)

    expect(screen.getByRole('checkbox')).not.toHaveClass(className)
  })

  test('will handle `defaultChecked` being false', () => {
    render(
      <Toggle
        defaultChecked={false}
      />,
    )

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  test('will handle `defaultChecked` being true', () => {
    render(
      <Toggle
        defaultChecked
      />,
    )

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  test('will hide icons if set false', () => {
    const { rerender } = render(<Toggle icons={false} />)

    expect(screen.getByTestId('toggle-track-check')).toBeEmptyDOMElement()
    expect(screen.getByTestId('toggle-track-x')).toBeEmptyDOMElement()

    rerender(<Toggle/>)

    expect(screen.getByTestId('toggle-track-check')).not.toBeEmptyDOMElement()
    expect(screen.getByTestId('toggle-track-x')).not.toBeEmptyDOMElement()
  })

  test('takes custom icons', () => {
    const checked = 'checked'
    const unchecked = 'unchecked'

    render(
      <Toggle
        icons={{
          checked,
          unchecked,
        }}
      />,
    )

    expect(screen.getByTestId('toggle-track-check')).toContainHTML(checked)
    expect(screen.getByTestId('toggle-track-x')).toContainHTML(unchecked)
  })

  test('defaults to the regular icon if only one is supplied', () => {
    const checked = 'checked'
    const unchecked = 'unchecked'

    const { rerender } = render(<Toggle icons={{ checked }}/>)

    expect(screen.getByTestId('toggle-track-check')).toContainHTML(checked)
    expect(screen.getByTestId('toggle-track-x')).not.toContainHTML(unchecked)

    rerender(<Toggle icons={{ unchecked }}/>)

    expect(screen.getByTestId('toggle-track-check')).not.toContainHTML(checked)
    expect(screen.getByTestId('toggle-track-x')).toContainHTML(unchecked)
  })

  test('does not render icon.un-/checked if null', () => {
    const checked = 'checked'
    const unchecked = 'unchecked'

    const { rerender } = render(
      <Toggle
        icons={{
          checked,
        }}
      />,
    )

    expect(screen.getByTestId('toggle-track-check')).toContainHTML(checked)
    expect(screen.getByTestId('toggle-track-x')).not.toContainHTML(unchecked)

    rerender(<Toggle icons={{ unchecked }}/>)

    expect(screen.getByTestId('toggle-track-check')).not.toContainHTML(checked)
    expect(screen.getByTestId('toggle-track-x')).toContainHTML(unchecked)
  })

  test('uses correct classNames based on state', () => {
    render(<Toggle/>)

    const wrapper = screen.getByTestId('toggle-wrapper')
    const checkbox = screen.getByRole('checkbox')

    expect(wrapper).toHaveClass(classNames.base)
    expect(wrapper).not.toHaveClass(classNames.focus)
    expect(wrapper).not.toHaveClass(classNames.checked)
    expect(wrapper).not.toHaveClass(classNames.disabled)

    fireEvent.click(wrapper)
    fireEvent.blur(checkbox)

    expect(wrapper).toHaveClass(classNames.base)
    expect(wrapper).not.toHaveClass(classNames.focus)
    expect(wrapper).toHaveClass(classNames.checked)
    expect(wrapper).not.toHaveClass(classNames.disabled)

    fireEvent.focus(checkbox)

    expect(wrapper).toHaveClass(classNames.base)
    expect(wrapper).toHaveClass(classNames.focus)
    expect(wrapper).toHaveClass(classNames.checked)
    expect(wrapper).not.toHaveClass(classNames.disabled)

    fireEvent.click(wrapper)

    expect(wrapper).toHaveClass(classNames.base)
    expect(wrapper).toHaveClass(classNames.focus)
    expect(wrapper).not.toHaveClass(classNames.checked)
    expect(wrapper).not.toHaveClass(classNames.disabled)
  })

  test('tests toggle on click', () => {
    render(<Toggle/>)

    const checkbox = screen.getByRole('checkbox')

    expect(checkbox).not.toBeChecked()
    fireEvent.click(screen.getByTestId('toggle-wrapper'))
    expect(checkbox).toBeChecked()
    fireEvent.click(screen.getByTestId('toggle-wrapper'))
    expect(checkbox).not.toBeChecked()
  })

  test('tests onChange callback', () => {
    const changeHandler = jest.fn()

    render(
      <Toggle
        onChange={() => {
          changeHandler()
        }}
      />,
    )

    expect(changeHandler).toHaveBeenCalledTimes(0)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(changeHandler).toHaveBeenCalledTimes(1)
  })

  test('tests onBlur callback', () => {
    const blurHandler = jest.fn()

    render(
      <Toggle
        onChange={noop}
        onBlur={blurHandler}
      />,
    )

    expect(blurHandler).toHaveBeenCalledTimes(0)
    fireEvent.blur(screen.getByRole('checkbox'))
    expect(blurHandler).toHaveBeenCalledTimes(1)
  })

  test('tests onFocus callback', () => {
    const focusHandler = jest.fn()

    render(
      <Toggle
        onChange={noop}
        onFocus={focusHandler}
      />,
    )

    expect(focusHandler).toHaveBeenCalledTimes(0)
    fireEvent.focus(screen.getByRole('checkbox'))
    expect(focusHandler).toHaveBeenCalledTimes(1)
  })

  test('tests toggle on touch with default unchecked', () => {
    render(
      <Toggle
        defaultChecked={false}
        onChange={noop}
      />,
    )

    expect(screen.getByRole('checkbox')).not.toBeChecked()

    const wrapper = screen.getByTestId('toggle-wrapper')
    fireEvent.touchStart(wrapper, {
      changedTouches: [{
        clientX: 30,
        clientY: 30,
      }],
    })

    fireEvent.touchMove(wrapper, {
      changedTouches: [{
        clientX: 55,
        clientY: 30,
      }],
    })

    fireEvent.touchEnd(wrapper, {
      changedTouches: [{
        clientX: 55,
        clientY: 30,
      }],
    })

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  test('tests toggle on touch with default checked', () => {
    render(
      <Toggle
        defaultChecked
        onChange={noop}
      />,
    )

    expect(screen.getByRole('checkbox')).toBeChecked()

    const wrapper = screen.getByTestId('toggle-wrapper')
    fireEvent.touchStart(wrapper, {
      changedTouches: [{
        clientX: 55,
        clientY: 30,
      }],
    })

    fireEvent.touchMove(wrapper, {
      changedTouches: [{
        clientX: 30,
        clientY: 30,
      }],
    })

    fireEvent.touchEnd(wrapper, {
      changedTouches: [{
        clientX: 30,
        clientY: 30,
      }],
    })

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})
